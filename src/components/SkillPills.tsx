'use client';
import React from 'react';
import type { Skill } from '@/lib/skills';

export function SkillPills({ title, items }:{ title:string; items: Skill[] }) {
  return (
    <div className="bg-white/[0.06] rounded-2xl border border-white/10 p-5">
      <div className="text-white font-semibold mb-3">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map(({ label, Icon }) => (
          <span key={label} className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/10">
            <Icon className="h-3.5 w-3.5 opacity-80" />
            <span className="opacity-90">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
