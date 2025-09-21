import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing, type AppLocale } from '@/i18n/routing';
import PageLayout from '@/components/PageLayout';
import { Container } from '@/components/Container';
import { Pill, Stat, CTA } from '@/components/case';
import Gallery from '@/components/Gallery';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

// ✅ SSG par locale pour éviter la réutilisation du HTML FR en /en
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// guard: string -> 'fr' | 'en'
function isAppLocale(l: string): l is AppLocale {
  return (routing.locales as readonly string[]).includes(l);
}

type Props = { params: Promise<{ locale: string }> };

export const dynamic = 'force-static';

export default async function AivyPage({ params }: Props) {
  const { locale } = await params; // Next 15: params est un Promise
  if (!isAppLocale(locale)) throw new Error('Unsupported locale');
  const typed = locale as AppLocale;

  // ⚠️ Toujours avant toute lecture i18n
  setRequestLocale(typed);

  // ✅ Demande explicite des messages dans la bonne langue
  const t = await getTranslations({ locale: typed, namespace: 'Cases.Aivy' });
  const tc = await getTranslations({ locale: typed, namespace: 'Common' });

  return (
    <PageLayout title={t('title')} showLinks={false}>
      <Container>
        {/* Retour — Link i18n => garde /en */}
        <div className="mb-4">
          <Link
            href={{ pathname: '/' }}
            locale={typed}
            className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {tc('backHome')}
          </Link>
        </div>

        <p className="opacity-90">{t('intro')}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>Anchor</Pill><Pill>Token-2022</Pill><Pill>Bubblegum cNFT</Pill>
          <Pill>Solana Agent Kit</Pill><Pill>Next.js 15</Pill>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Stat label={t('stats.ttf.label')} value={t('stats.ttf.value')} hint={t('stats.ttf.hint')} />
          <Stat label={t('stats.cpi.label')} value={t('stats.cpi.value')} hint={t('stats.cpi.hint')} />
          <Stat label={t('stats.depl.label')} value={t('stats.depl.value')} hint={t('stats.depl.hint')} />
        </div>

        <div className="mt-10">
          <Gallery
            aspect="16/9"
            fit="contain"
            showCaptions
            images={[
              { src: '/projects/aivy/aivy.png', alt: 'Aivy cover', title: t('gallery.cover') },
              { src: '/projects/aivy/deploy-nft-collection.png', alt: 'Deploy NFT Collection', title: t('gallery.deploy') },
              { src: '/projects/aivy/solscan-confirmation.png', alt: 'Solscan Confirmation', title: t('gallery.solscan') }
            ]}
          />
        </div>

        {/* CTA — wrap dans Link i18n pour garder la locale */}
        <div className="mt-12">
          <Link href={{ pathname: '/', hash: 'contact' }} locale={typed}>
            <CTA variant="primary" size="lg" align="center" withArrow>
              {t('cta')}
            </CTA>
          </Link>
        </div>
      </Container>
    </PageLayout>
  );
}
