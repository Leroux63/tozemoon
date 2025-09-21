'use client';

import * as THREE from 'three';
import React, {useEffect, useMemo, useRef} from 'react';
import {useGLTF} from '@react-three/drei';
import FlamesOne from './FlamesOne';

type Phase = 'idle' | 'countdown' | 'launch' | 'transfer' | 'capture' | 'orbit';

type Props = {
  thrust: number;
  rocketPath: string;
  flamesPath: string;
  nozzleOffset?: [number, number, number];
  rocketScale?: number;
  phase: Phase;
  phaseProgress: number; // 0..1
  clipPlane?: { normal: [number, number, number]; constant: number };
};

export default function RocketWithFlames({
  thrust,
  rocketPath,
  flamesPath,
  nozzleOffset = [0, -0.62, 0],
  rocketScale = 0.2,
  phase,
  phaseProgress,
  clipPlane
}: Props) {
  const rocket = useGLTF(rocketPath);
  const rocketRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    rocket.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m?.isMesh) { m.castShadow = true; m.receiveShadow = true; }
    });
  }, [rocket.scene]);

  const showFlame = phase !== 'idle' && phase !== 'countdown';

  const cfg = useMemo(() => {
    if (phase === 'launch') {
      const p = THREE.MathUtils.clamp(phaseProgress, 0, 1);
      if (p < 0.35) {
        return { name: 'Very_Small_Flame001' as const, uniformScale: 0.10,  offsetLocal: [0, +0.028, 0] as [number,number,number] };
      }
      return   { name: 'Active_flame'       as const, uniformScale: 0.12,  offsetLocal: [0, +0.030, 0] as [number,number,number] };
    }
    if (phase === 'transfer') {
      return   { name: 'Mid_Flame'          as const, uniformScale: 0.115, offsetLocal: [0, +0.028, 0] as [number,number,number] };
    }
    if (phase === 'capture' || phase === 'orbit') {
      return   { name: 'Calm_Flame'         as const, uniformScale: 0.105, offsetLocal: [0, +0.026, 0] as [number,number,number] };
    }
    return     { name: 'Very_Small_Flame001' as const, uniformScale: 0.10,  offsetLocal: [0, +0.026, 0] as [number,number,number] };
  }, [phase, phaseProgress]);

  return (
    <group scale={rocketScale}>
      <group ref={rocketRef}>
        <primitive object={rocket.scene} />
      </group>

      {showFlame && (
        <group position={nozzleOffset} rotation={[0, 0, 0]}>
          <FlamesOne
            key={cfg.name}
            thrust={thrust}
            path={flamesPath}
            name={cfg.name}
            offsetLocal={cfg.offsetLocal}
            pointDown={false}
            uniformScale={cfg.uniformScale}
            debug={false}
            clipPlane={clipPlane}
          />
        </group>
      )}
    </group>
  );
}

useGLTF.preload('/models/rocket.glb');
useGLTF.preload('/models/flame.glb');
