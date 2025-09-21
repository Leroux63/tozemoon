// src/app/[locale]/layout.tsx
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { routing, type AppLocale } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// type guard: string -> 'fr' | 'en'
function isAppLocale(l: string): l is AppLocale {
  return (routing.locales as readonly string[]).includes(l);
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Next 15 => params est un Promise
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const typed = locale as AppLocale;

  // Toujours avant tout appel next-intl
  setRequestLocale(typed);

  const t = await getTranslations({ locale: typed });
  const title = `${t('Hero.title.part1')} ${t('Hero.title.part2')} ${t('Hero.title.part3')} ${t('Hero.title.part4')}`;
  return { title };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const typed = locale as AppLocale;

  // 1) fixe la locale côté serveur
  setRequestLocale(typed);
  // 2) et SURTOUT: récupère les messages pour CETTE locale explicitement
  const messages = await getMessages({ locale: typed });

  return (
    <NextIntlClientProvider locale={typed} messages={messages}>
      <Header />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
