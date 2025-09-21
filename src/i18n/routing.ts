import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'] as const,
  defaultLocale: 'fr',
  pathnames: {
    '/': '/',
    '/pathnames': { fr: '/chemins', en: '/pathnames' },
    '/projects': { fr: '/projets', en: '/projects' },
    '/projects/[slug]': { fr: '/projets/[slug]', en: '/projects/[slug]' }
  }
});

export type AppLocale = (typeof routing.locales)[number];
