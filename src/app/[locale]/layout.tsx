// app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { Locale, hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// SSG des locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Métadonnées localisées
type MetaProps = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: MetaProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const title = `${t('Hero.title.part1')} ${t('Hero.title.part2')} ${t('Hero.title.part3')} ${t('Hero.title.part4')}`;
  return { title };
}

// Layout pour chaque locale (⚠️ pas de <html> ni <body> ici)
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />   {/* ✅ ton Header (avec switch intégré) */}
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
