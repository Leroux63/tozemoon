'use client';

import * as React from 'react';
import {useGLTF} from '@react-three/drei';

export default function GLBInspector({url}:{url:string}) {
  const gltf = useGLTF(url);

  React.useEffect(() => {
    const lines: string[] = [];
    gltf.scene.traverse((obj:any) => {
      const mat = (obj.material ? (Array.isArray(obj.material) ? obj.material.map((m:any)=>m.name).join(',') : obj.material.name) : '');
      lines.push(`${obj.type}  ${obj.name || '(no-name)'}  ${mat ? '— mat: '+mat : ''}`);
    });
    // Animations, si présentes
    if (gltf.animations?.length) {
      lines.push(`\nAnimations: ${gltf.animations.map(a=>a.name).join(', ')}`);
    }
    console.group(`GLB INSPECT: ${url}`);
    console.log(lines.join('\n'));
    console.groupEnd();
  }, [gltf, url]);

  return null;
}
