'use client';

import * as THREE from 'three';
import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/** Type minimal pour le résultat de useGLTF sans dépendre de three-stdlib */
type GLTFLike = { scene: THREE.Group };

type ClipPlane = { normal: [number, number, number]; constant: number };

type Props = {
  /** Conservé pour compat compat API externe (actuellement non utilisé ici) */
  thrust: number;
  path?: string;
  name?: string;
  offsetLocal?: [number, number, number];
  pointDown?: boolean;
  uniformScale?: number;
  debug?: boolean;
  clipPlane?: ClipPlane;
};

type ClippableMaterial = THREE.Material & {
  clippingPlanes?: THREE.Plane[] | null;
  clipShadows?: boolean;
  transparent?: boolean;
  depthWrite?: boolean;
  clone(): THREE.Material;
};

export default function FlamesOne({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  thrust: _thrust,
  path = '/models/flame.glb',
  name = 'Very_Small_Flame001',
  offsetLocal = [0, 0, 0],
  pointDown = false,
  uniformScale = 1,
  debug = false,
  clipPlane
}: Props) {
  // ⚠️ on caste vers un type minimal que l’on contrôle (pas de any, pas de three-stdlib)
  const glb = useGLTF(path) as unknown as GLTFLike;

  const mesh = useMemo(() => {
    const src = glb.scene.getObjectByName(name) as THREE.Mesh | null;
    if (!src) return null;

    // Appliquer la matrice locale du mesh source à sa géométrie clonée
    src.updateMatrix();
    const geo = (src.geometry as THREE.BufferGeometry).clone();
    geo.applyMatrix4(src.matrix.clone());
    if (pointDown) {
      geo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI));
    }

    // Recentrer: ancrer la base au niveau Y=0, centrer X/Z
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const cx = (bb.min.x + bb.max.x) * 0.5;
    const cz = (bb.min.z + bb.max.z) * 0.5;
    const anchorY = bb.max.y; // pointe vers +Y
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(-cx, -anchorY, -cz));

    // Material cloné et typé (sans any)
    const srcMat = Array.isArray(src.material) ? src.material[0] : src.material;
    const baseMat = srcMat as ClippableMaterial;
    const mat = baseMat.clone() as ClippableMaterial;

    // Plan de clipping optionnel
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

    // ✅ Pas de dépendance "path" : useGLTF réagira déjà si le path change,
    // et glb.scene (objet) changera => le memo recalculera via cette dep.
  }, [glb.scene, name, pointDown, debug, clipPlane]);

  return mesh ? (
    <group position={offsetLocal} scale={uniformScale}>
      <primitive object={mesh} />
    </group>
  ) : null;
}

// Préchargement du modèle
useGLTF.preload('/models/flame.glb');
