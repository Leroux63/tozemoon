'use client';

import * as THREE from 'three';
import React, {useMemo} from 'react';
import {useGLTF} from '@react-three/drei';

type ClipPlane = { normal: [number, number, number]; constant: number };

type Props = {
  thrust: number;
  path?: string;
  name?: string;
  offsetLocal?: [number, number, number];
  pointDown?: boolean;
  uniformScale?: number;
  debug?: boolean;
  clipPlane?: ClipPlane;
};

export default function FlamesOne({
  thrust,
  path = '/models/flame.glb',
  name = 'Very_Small_Flame001',
  offsetLocal = [0, 0, 0],
  pointDown = false,
  uniformScale = 1,
  debug = false,
  clipPlane
}: Props) {
  const glb = useGLTF(path);

  const mesh = useMemo(() => {
    const src = glb.scene.getObjectByName(name) as THREE.Mesh | null;
    if (!src) return null;

    src.updateMatrix();
    const geo = (src.geometry as THREE.BufferGeometry).clone();
    geo.applyMatrix4(src.matrix.clone());
    if (pointDown) geo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI));

    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const cx = (bb.min.x + bb.max.x) * 0.5;
    const cz = (bb.min.z + bb.max.z) * 0.5;
    const anchorY = bb.max.y; // pointe vers +Y
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(-cx, -anchorY, -cz));

    const baseMat = (Array.isArray(src.material) ? src.material[0] : src.material) as THREE.Material & {
      clippingPlanes?: any; clipShadows?: boolean; transparent?: boolean; depthWrite?: boolean;
    };
    const mat = baseMat.clone() as any;

    if (clipPlane) {
      const n = new THREE.Vector3(...clipPlane.normal).normalize();
      mat.clippingPlanes = [new THREE.Plane(n, clipPlane.constant)];
      mat.clipShadows = false;
      mat.transparent = true;
      mat.depthWrite = false;
    }

    const baked = new THREE.Mesh(geo, mat);
    baked.castShadow = src.castShadow;
    baked.receiveShadow = src.receiveShadow;

    if (debug) {
      console.group(`[FlamesOne] "${name}"`);
      console.log('bbox size:', geo.boundingBox?.getSize(new THREE.Vector3()));
      console.log('clipPlane:', clipPlane);
      console.groupEnd();
    }
    return baked;
  }, [glb.scene, name, pointDown, path, debug, clipPlane]);

  return mesh ? (
    <group position={offsetLocal} scale={uniformScale}>
      <primitive object={mesh} />
    </group>
  ) : null;
}

useGLTF.preload('/models/flame.glb');
