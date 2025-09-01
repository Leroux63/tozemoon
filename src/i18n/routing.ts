import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  pathnames: {
    '/': '/',
    '/pathnames': {
      fr: '/chemins',     // ou ce que tu veux comme traduction FR
      en: '/pathnames'    // la version anglaise
    }
  }
});
