'use client';

import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Stars, useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { easing } from 'maath';
import RocketWithFlames from './RocketWithFlames';

function asPerspective(cam: THREE.Camera): cam is THREE.PerspectiveCamera {
  return (cam as THREE.PerspectiveCamera).isPerspectiveCamera === true;
}
function asOrtho(cam: THREE.Camera): cam is THREE.OrthographicCamera {
  return (cam as THREE.OrthographicCamera).isOrthographicCamera === true;
}

const DUR = { idle: 1.2, countdown: 1.2, launch: 5.0, transfer: 7.5, capture: 2.4 } as const;
const TOTAL_TO_ORBIT = DUR.idle + DUR.countdown + DUR.launch + DUR.transfer + DUR.capture;

const EARTH_R = 50;
const EARTH_CENTER = new THREE.Vector3(0, -EARTH_R, -260);
const MOON_R = EARTH_R * 0.273;
const MOON_DIST = 1200;
const MOON_POS = new THREE.Vector3(0, 0, -MOON_DIST);
const ORBIT_R = MOON_R * 1.4;
const ORBIT_OMEGA = 0.45;

const LAUNCH_LAT = 28.60839;
const LAUNCH_LON = -80.60433;

const CAM_OFFSET_CLOSE = new THREE.Vector3(1.2, 0.9, 1.5);
const CAM_OFFSET_FAR = new THREE.Vector3(0.6, 0.4, 0.8);
const FAR_THRESHOLD = 400;
const CAM_DAMP = 0.25;

const ZOOM = { desiredScreenHeight: 220, minFov: 32, maxFov: 58, lerp: 0.08 };
const LAUNCH_APOGEE = 8.5;

type Phase = 'idle' | 'countdown' | 'launch' | 'transfer' | 'capture' | 'orbit';
const d2r = (d: number) => (d * Math.PI) / 180;
const smooth01 = (t: number) => THREE.MathUtils.smootherstep(t, 0, 1);
const lerp = THREE.MathUtils.lerp;

function latLonToCartesian(R: number, latDeg: number, lonDeg: number, center: THREE.Vector3) {
  const lat = d2r(latDeg);
  const lon = d2r(lonDeg);
  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);
  const p = new THREE.Vector3(x, y, z).add(center);
  const normal = new THREE.Vector3(x, y, z).normalize();
  return { position: p, normal };
}

function keepCameraAboveEarth(
  camPos: THREE.Vector3,
  margin: number,
  earthCenter: THREE.Vector3,
  earthR: number
) {
  const v = camPos.clone().sub(earthCenter);
  const minLen = earthR + margin;
  if (v.length() < minLen) {
    v.setLength(minLen);
    camPos.copy(earthCenter).add(v);
  }
  return camPos;
}

function avoidEarthOcclusion(
  camPos: THREE.Vector3,
  rocketPos: THREE.Vector3,
  earthCenter: THREE.Vector3,
  earthR: number,
  safety = 0.35
) {
  const d = rocketPos.clone().sub(camPos);
  const f = camPos.clone().sub(earthCenter);
  const t = -f.dot(d) / d.lengthSq();
  const tClamped = THREE.MathUtils.clamp(t, 0, 1);
  const closest = camPos.clone().add(d.clone().multiplyScalar(tClamped));
  const dist = closest.distanceTo(earthCenter);

  if (dist < earthR + safety) {
    const sign = Math.sign(rocketPos.clone().sub(earthCenter).dot(CAM_OFFSET_CLOSE)) || 1;
    const away = rocketPos.clone().sub(earthCenter).normalize().multiplyScalar(1.2);
    const corrected = rocketPos.clone().add(CAM_OFFSET_CLOSE.clone().multiplyScalar(sign)).add(away);
    camPos.copy(corrected);
  }
  return camPos;
}

export default function RocketScene() {
  const { camera, gl, size } = useThree();

  const rocket = useRef<THREE.Group>(null!);
  const moon = useRef<THREE.Mesh>(null!);
  const earth = useRef<THREE.Mesh>(null!);

  const [moonColor, moonDisp] = useTexture([
    '/textures/moon/lroc_color_poles_1k.jpg',
    '/textures/moon/ldem_3_8bit.jpg',
  ]) as [THREE.Texture, THREE.Texture];

  const [earthColor] = useTexture(['/textures/earth/earth_day_2k.jpg']) as [THREE.Texture];

  useEffect(() => {
    gl.localClippingEnabled = true;
    camera.near = 0.05;
    camera.far = 10000;
    if (asPerspective(camera) || asOrtho(camera)) camera.updateProjectionMatrix();
  }, [camera, gl]);

  const site = useMemo(() => latLonToCartesian(EARTH_R, LAUNCH_LAT, LAUNCH_LON, EARTH_CENTER), []);
  const rocketQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), site.normal.clone());
    return q;
  }, [site.normal]);

  const clipPlane = useMemo(() => {
    const n = site.normal.clone().normalize();
    const d = -n.dot(site.position);
    return { normal: [n.x, n.y, n.z] as [number, number, number], constant: d };
  }, [site.normal, site.position]);

  const start = useMemo(() => performance.now() / 1000, []);
  const [lockedOrbit, setLockedOrbit] = useState(false);
  const [thrust, setThrust] = useState(0);

  const transferCurve = useMemo(() => {
    const up = site.normal.clone();
    const transferStart = site.position.clone().add(up.clone().multiplyScalar(LAUNCH_APOGEE));
    const p1 = transferStart.clone().add(new THREE.Vector3(2.0, -0.2, -4.0));
    const p2 = transferStart.clone().add(new THREE.Vector3(5.0, -0.8, -12.0));
    const p3 = transferStart.clone().add(new THREE.Vector3(8.5, -2.0, -20.0));
    const p4 = site.position.clone().lerp(MOON_POS, 0.25).add(new THREE.Vector3(0, 2.0, -10.0));
    const p5 = site.position.clone().lerp(MOON_POS, 0.45).add(new THREE.Vector3(0, 1.0, -20.0));
    return new THREE.CatmullRomCurve3([transferStart, p1, p2, p3, p4, p5], false, 'catmullrom', 0.2);
  }, [site.position, site.normal]);

  useEffect(() => {
    const restPos = site.position.clone().add(site.normal.clone().multiplyScalar(0.02));
    const initCam = restPos.clone().add(CAM_OFFSET_CLOSE);
    keepCameraAboveEarth(initCam, 0.6, EARTH_CENTER, EARTH_R);
    camera.position.copy(initCam);
    camera.lookAt(site.position);
    if (asPerspective(camera)) {
      camera.fov = 50;
      camera.updateProjectionMatrix();
    }
  }, [camera, site.position, site.normal]);

  const phaseRef = useRef<Phase>('idle');
  const phaseProgressRef = useRef(0);

  const rocketBounds = useRef<{ sphere: THREE.Sphere | null }>({ sphere: null });
  useEffect(() => {
    const id = setInterval(() => {
      if (rocket.current && rocket.current.children.length > 0) {
        const box = new THREE.Box3().setFromObject(rocket.current);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        rocketBounds.current.sphere = sphere;
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  function adjustFovForRocketSize() {
    if (!rocketBounds.current.sphere) return;
    if (!asPerspective(camera)) return;

    const sphere = rocketBounds.current.sphere;
    const camToRocket = sphere.center.clone().sub(camera.position).length();
    const apparent =
      (sphere.radius / camToRocket) *
      (size.height / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)));
    const target = ZOOM.desiredScreenHeight;
    const ratio = THREE.MathUtils.clamp(target / (apparent + 1e-6), 0.6, 1.6);
    const targetFov = THREE.MathUtils.clamp(camera.fov * ratio, ZOOM.minFov, ZOOM.maxFov);

    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, ZOOM.lerp);
    camera.updateProjectionMatrix();
  }

  const followCamWorld = (rocketPos: THREE.Vector3, dt: number, clampToEarth: boolean) => {
    const dist = camera.position.distanceTo(rocketPos);
    const offset = dist > FAR_THRESHOLD ? CAM_OFFSET_FAR : CAM_OFFSET_CLOSE;
    const desired = rocketPos.clone().add(offset);

    if (clampToEarth) keepCameraAboveEarth(desired, 0.6, EARTH_CENTER, EARTH_R);
    avoidEarthOcclusion(desired, rocketPos, EARTH_CENTER, EARTH_R, 0.45);
    easing.damp3(camera.position, desired, CAM_DAMP, dt);
    camera.lookAt(rocketPos);
  };

  useFrame((state, dt) => {
    const t = performance.now() / 1000 - start;
    if (moon.current) moon.current.rotation.y += dt * 0.03;
    if (earth.current) earth.current.rotation.y += dt * 0.0015;

    let thrustTarget = 0;
    const idleEnd = DUR.idle;
    const countEnd = idleEnd + DUR.countdown;
    const launchEnd = countEnd + DUR.launch;
    const transfEnd = launchEnd + DUR.transfer;
    const captEnd = transfEnd + DUR.capture;

    let phase: Phase = 'orbit';
    let phaseProgress = 0;

    if (!lockedOrbit) {
      if (t < idleEnd) {
        phase = 'idle'; phaseProgress = t / DUR.idle;
        const restPos = site.position.clone().add(site.normal.clone().multiplyScalar(0.02));
        rocket.current.position.copy(restPos);
        rocket.current.quaternion.copy(rocketQuat);
        followCamWorld(rocket.current.position, dt, true);
        thrustTarget = 0.0;
      } else if (t < countEnd) {
        phase = 'countdown'; phaseProgress = (t - idleEnd) / DUR.countdown;
        const vib = Math.sin(state.clock.elapsedTime * 40) * 0.002;
        const base = site.position.clone().add(site.normal.clone().multiplyScalar(0.02));
        rocket.current.position.copy(base).add(site.normal.clone().multiplyScalar(vib));
        rocket.current.quaternion.copy(rocketQuat);
        followCamWorld(rocket.current.position, dt, true);
        thrustTarget = 0.0;
      } else if (t < launchEnd) {
        phase = 'launch'; phaseProgress = (t - countEnd) / DUR.launch;
        const p = smooth01(phaseProgress);
        const height = lerp(0, LAUNCH_APOGEE, p);
        const pos = site.position.clone().add(site.normal.clone().multiplyScalar(height));
        rocket.current.position.copy(pos);
        rocket.current.quaternion.copy(rocketQuat);
        followCamWorld(rocket.current.position, dt, true);
        thrustTarget = lerp(0.0, 1.0, p);
      } else if (t < transfEnd) {
        phase = 'transfer'; phaseProgress = (t - launchEnd) / DUR.transfer;
        const p = smooth01(phaseProgress);
        const pAhead = Math.min(p + 0.002, 1);
        const point = transferCurve.getPointAt(p);
        const tangent = transferCurve.getTangentAt(pAhead).normalize();
        rocket.current.position.copy(point);
        const qRocket = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        rocket.current.quaternion.slerp(qRocket, Math.min(1, dt * 6));
        followCamWorld(rocket.current.position, dt, false);
        thrustTarget = lerp(0.8, 0.55, p);
      } else if (t < captEnd) {
        phase = 'capture'; phaseProgress = (t - transfEnd) / DUR.capture;
        const p = smooth01(phaseProgress);
        const angle = lerp(-Math.PI * 0.25, 0, p);
        const r = lerp(ORBIT_R * 1.6, ORBIT_R, p);
        const orbitPos = new THREE.Vector3(
          MOON_POS.x + Math.cos(angle) * r,
          MOON_POS.y + lerp(0.2, 0.05, p),
          MOON_POS.z + Math.sin(angle) * r
        );
        rocket.current.position.copy(orbitPos);
        const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
        const qRocket = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        rocket.current.quaternion.slerp(qRocket, Math.min(1, dt * 6));
        followCamWorld(rocket.current.position, dt, false);
        thrustTarget = 0.12;
      } else {
        setLockedOrbit(true);
      }
    } else {
      phase = 'orbit'; phaseProgress = 0;
      const tOrbit = (performance.now() / 1000 - start - TOTAL_TO_ORBIT);
      const angle = tOrbit * ORBIT_OMEGA;
      const orbitPos = new THREE.Vector3(
        MOON_POS.x + Math.cos(angle) * ORBIT_R,
        MOON_POS.y + Math.sin(angle * 0.4) * 0.08,
        MOON_POS.z + Math.sin(angle) * ORBIT_R
      );
      rocket.current.position.copy(orbitPos);
      const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
      const qRocket = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      rocket.current.quaternion.slerp(qRocket, Math.min(1, dt * 6));
      followCamWorld(rocket.current.position, dt, false);
      thrustTarget = 0.10;
    }

    if (Math.abs(thrust - thrustTarget) > 0.01) setThrust(thrustTarget);
    adjustFovForRocketSize();

    phaseRef.current = phase;
    phaseProgressRef.current = phaseProgress;
  });

  const phase = phaseRef.current;
  const phaseProgress = phaseProgressRef.current;
  const showMoon = phase === 'transfer' || phase === 'capture' || phase === 'orbit';

  return (
    <>
      <color attach="background" args={['#02040a']} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 7, 3]} intensity={1.25} />
      <Environment preset="night" />
      <Stars radius={800} depth={60} count={8000} factor={6} fade />

      <mesh ref={earth} position={EARTH_CENTER.toArray()}>
        <sphereGeometry args={[EARTH_R, 256, 256]} />
        <meshStandardMaterial map={earthColor} metalness={0} roughness={1} />
      </mesh>

      {showMoon && (
        <mesh ref={moon} position={MOON_POS.toArray()} scale={[1, 1, 1]}>
          <sphereGeometry args={[MOON_R, 256, 256]} />
          <meshStandardMaterial
            map={moonColor}
            displacementMap={moonDisp}
            displacementScale={MOON_R * 0.02}
            bumpMap={moonDisp}
            bumpScale={MOON_R * 0.01}
            roughness={1}
            metalness={0}
          />
        </mesh>
      )}

      <group ref={rocket}>
        <RocketWithFlames
          thrust={thrust}
          rocketPath="/models/rocket.glb"
          flamesPath="/models/flame.glb"
          nozzleOffset={[0, -0.62, 0]}
          rocketScale={0.2}
          phase={phase}
          phaseProgress={phaseProgress}
          clipPlane={clipPlane}
        />
      </group>
    </>
  );
}
