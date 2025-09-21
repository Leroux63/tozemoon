import {defineRouting} from 'next-intl/routing';

// Routing i18n + slug dynamique pour les projets
export const routing = defineRouting({
  locales: ['fr', 'en'] as const,
  defaultLocale: 'fr',
  pathnames: {
    '/': '/',

    // (si tu l’utilises)
    '/pathnames': {
      fr: '/chemins',
      en: '/pathnames'
    },

    // ✅ liste des projets (localisée)
    '/projects': {
      fr: '/projets',
      en: '/projects'
    },

    // ✅ page projet avec slug dynamique (localisée)
    '/projects/[slug]': {
      fr: '/projets/[slug]',
      en: '/projects/[slug]'
    }
  }
});

export type AppLocale = (typeof routing.locales)[number];
