// app/[locale]/projects/aivy/page.tsx
import type { Locale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageLayout from '@/components/PageLayout';
import { Container } from '@/components/Container';
import { Pill, Stat, CTA } from '@/components/case';
import Gallery from '@/components/Gallery';
import { Link } from '@/i18n/navigation';      // ⬅️ pour préserver la locale
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ locale: Locale }> };

export const dynamic = 'force-static';

export default async function AivyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Cases.Aivy');
  const tc = await getTranslations('Common');   // ⬅️ nouvelles clés

  return (
    <PageLayout title={t('title')} showLinks={false}>
      <Container>

        {/* Lien retour */}
        <div className="mb-4">
          <Link
            href="/"
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

        {/* Galerie avec titres + lightbox */}
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

        {/* CTA bien visible + centré */}
 
          <div className="mt-12">
            <CTA href="/#contact" variant="primary" size="lg" align="center" withArrow>
              {t('cta')}
            </CTA>
          </div>

      </Container>
    </PageLayout>
  );
}
