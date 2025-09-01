'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export function ProjectCard({ name, summary, tags, hrefCase, hrefLive }:{
  name: string; summary: string; tags: string[]; hrefCase: string; hrefLive?: string;
}){
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="text-lg font-semibold text-white">{name}</div>
      <div className="text-sm opacity-90">{summary}</div>
      <div className="flex flex-wrap gap-2">
        {tags.map(t => (
          <span key={t} className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#FFFFFF1A', color: '#66D1D8'}}>{t}</span>
        ))}
      </div>
      <div className="flex gap-3 mt-auto">
        <Button className="rounded-xl" asChild>
          <a href={hrefCase}>Cas d’étude</a>
        </Button>
        {hrefLive && (
          <Button className="rounded-xl btn-ghost" variant="outline" asChild>
            <a target="_blank" rel="noreferrer" href={hrefLive}>Voir en ligne</a>
          </Button>
        )}
      </div>
    </div>
  );
}