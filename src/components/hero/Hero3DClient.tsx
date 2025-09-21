// src/components/hero/Hero3DClient.tsx
'use client';
import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full max-w-md aspect-square bg-white/5 rounded-3xl shadow-lg p-8" />
  )
});

export default function Hero3DClient() {
  return <Hero3D />;
}
