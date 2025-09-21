'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export type ProjectSlug = 'aivy' | 'metaflow' | 'sunsaver';

export function ProjectCard({
  name,
  summary,
  tags,
  slug,
  hrefLive
}: {
  name: string;
  summary: string;
  tags: string[];
  slug: ProjectSlug;
  hrefLive?: string;
}) {
  const t = useTranslations('Projects.card');

  return (
    <div className="card p-5 flex flex-col gap-4 bg-white/5 rounded-2xl border border-white/10">
      <div className="text-lg font-semibold text-white">{name}</div>
      <div className="text-sm opacity-90">{summary}</div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-full"
            style={{ backgroundColor: '#FFFFFF1A', color: '#66D1D8' }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-auto">
        <Button className="rounded-xl" asChild>
          <Link
            href={{ pathname: '/projects/[slug]', params: { slug } }}
            aria-label={t('caseAria', { name })}
          >
            {t('case')}
          </Link>
        </Button>
        {hrefLive && (
          <Button className="rounded-xl" variant="outline" asChild>
            <a
              href={hrefLive}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('liveAria', { name })}
            >
              {t('live')}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
