'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import RocketScene from './RocketScene';

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, localClippingEnabled: true }}
      // On laisse la caméra par défaut de R3F, configurée via RocketScene (near/far + snap initial)
      camera={{ position: [0, 1.2, 4.8], fov: 52, near: 0.05, far: 10000 }}
      shadows
    >
      <Suspense fallback={null}>
        <RocketScene />
      </Suspense>
    </Canvas>
  );
}
