'use client';
import React from 'react';
import { palette } from '@/lib/palette';

export function Section({ id, title, kicker, children }:{id:string,title:string,kicker?:string,children:React.ReactNode}){
  return (
    <section id={id} className="section">
      <div className="mb-8">
        {kicker && <p className="text-sm tracking-widest uppercase" style={{color: palette.lunarTeal}}>{kicker}</p>}
        <h2 className="text-2xl md:text-4xl font-semibold" style={{color: '#fff'}}>{title}</h2>
      </div>
      {children}
    </section>
  );
}