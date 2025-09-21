'use client';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';

type FlameNames =
  | 'Mid_Flame'
  | 'Active_flame'
  | 'Calm_Flame'
  | 'Small_Flame'
  | 'Color_Flame'
  | 'Very_Small_Flame001';

type Props = {
  thrust: number;
  path?: string;
  direction?: 1 | -1;   // informatif
  scale?: number;
  debug?: boolean;
};

export default function Flames({
  thrust,
  path = '/models/flame.glb',
  direction = -1,
  scale = 1,
  debug = true
}: Props) {
  const {scene} = useGLTF(path);
  const flameRoot = useMemo(() => scene.clone(true), [scene]);
  const group = useRef<THREE.Group>(null!);

  const parts = useRef<Record<FlameNames, THREE.Mesh | null>>({
    Mid_Flame: null,
    Active_flame: null,
    Calm_Flame: null,
    Small_Flame: null,
    Color_Flame: null,
    Very_Small_Flame001: null
  });

  const [onceLogged, setOnceLogged] = useState(false);
  const lastLOD = useRef<string>('');

  useEffect(() => {
    // NE PAS retourner le groupe ici — ton modèle est déjà orienté pointe vers -Y
    // group.current.rotation.set(direction === -1 ? 0 : Math.PI, 0, 0);

    // attacher les refs
    (Object.keys(parts.current) as FlameNames[]).forEach((name) => {
      parts.current[name] = flameRoot.getObjectByName(name) as THREE.Mesh | null;
    });

    // conserver les matériaux d'origine, activer juste additif/alpha
    flameRoot.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const apply = (mat: any) => {
        mat.transparent = true;
        mat.depthWrite = false;
        mat.blending = THREE.AdditiveBlending;
        mat.needsUpdate = true;
      };
      if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
      else apply(mesh.material);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });

    if (debug && !onceLogged) {
      const wanted: FlameNames[] = [
        'Very_Small_Flame001',
        'Small_Flame',
        'Calm_Flame',
        'Mid_Flame',
        'Active_flame',
        'Color_Flame'
      ];
      const found = wanted.map((n) => ({
        name: n,
        present: !!parts.current[n],
        type: parts.current[n]?.type,
      }));
      console.group('[Flames] Meshes trouvés dans GLB');
      console.table(found);
      console.groupEnd();
      setOnceLogged(true);
    }
  }, [flameRoot, direction, debug, onceLogged]);

  useFrame(({clock}) => {
    const base = THREE.MathUtils.clamp(thrust, 0, 1);
    const jitter = 0.02 + Math.sin(clock.elapsedTime * 30) * 0.01 + Math.random() * 0.01;
    const t = Math.max(base * (1 + jitter), 0);

    // Choisir 1 variante (LOD) selon la poussée
    const lodIdx =
      t > 0.85 ? 4 :
      t > 0.60 ? 3 :
      t > 0.30 ? 2 :
      t > 0.10 ? 1 : 0;

    const names: FlameNames[] = [
      'Very_Small_Flame001',
      'Small_Flame',
      'Calm_Flame',
      'Mid_Flame',
      'Active_flame'
    ];
    const chosen = names[lodIdx];

    // afficher UNE seule flamme principale + (optionnel) cœur bleu au-dessus d’un certain seuil
    const colorOn = t > 0.25;

    (Object.keys(parts.current) as FlameNames[]).forEach((name) => {
      const mesh = parts.current[name];
      if (!mesh) return;

      const isCore = name === chosen;
      const isBlue = name === 'Color_Flame';
      const visible = isCore || (isBlue && colorOn);

      mesh.visible = visible;

      // *** Pas d’entonnoir : on NE TOUCHE PAS X/Z ***
      // on garde la géométrie native (juste scale global uniforme)
      mesh.scale.set(scale, scale, scale);

      // Option : animer très légèrement l’opacité/intensité
      const apply = (mat: any) => {
        if (mat.opacity !== undefined) mat.opacity = isCore ? 0.85 : 0.5;
        if (mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = isCore ? (1.2 + t * 1.5) : (0.8 + t * 0.8);
        }
      };
      if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
      else apply(mesh.material);
    });

    const key = `${chosen}${colorOn ? '+Color' : ''}`;
    if (debug && key !== lastLOD.current) {
      lastLOD.current = key;
      console.log(`[Flames] thrust=${base.toFixed(2)} → ${key}`);
    }
  });

  return (
    <group ref={group} scale={1}>
      <primitive object={flameRoot} />
    </group>
  );
}

useGLTF.preload('/models/flame.glb');
