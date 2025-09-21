// app/[locale]/projects/metaflow/page.tsx
import type { Locale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageLayout from '@/components/PageLayout';
import { Container } from '@/components/Container';
import { Pill, Stat, CTA } from '@/components/case';
import Gallery from '@/components/Gallery';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ locale: Locale }> };

export const dynamic = 'force-static';

export default async function MetaFlowPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Cases.MetaFlow');
  const tc = await getTranslations('Common');

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

        {/* Tech pills (mise à jour : Helia/IPFS + Livepeer) */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>USDC (SPL)</Pill><Pill>Anchor</Pill><Pill>Helia (IPFS)</Pill>
          <Pill>Livepeer</Pill><Pill>Next.js 15</Pill><Pill>Helius RPC</Pill>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Stat label={t('stats.ttf.label')} value={t('stats.ttf.value')} hint={t('stats.ttf.hint')} />
          <Stat label={t('stats.fees.label')} value={t('stats.fees.value')} hint={t('stats.fees.hint')} />
          <Stat label={t('stats.split.label')} value={t('stats.split.value')} hint={t('stats.split.hint')} />
        </div>

        {/* Galerie (mise à jour : cover + creator form + unlocked content) */}
        <div className="mt-10">
          <Gallery
            aspect="16/9"
            fit="contain"
            showCaptions
            images={[
              { src: '/projects/metaflow/metaflow.png', alt: 'MetaFlow cover', title: t('gallery.cover') },
              { src: '/projects/metaflow/creator.png', alt: 'Creator onboarding form', title: t('gallery.creator') },
              { src: '/projects/metaflow/content.png', alt: 'Unlocked content view', title: t('gallery.unlocked') }
            ]}
          />
        </div>

        {/* CTA */}
        <div className="mt-12">
          <CTA href="/#contact" variant="primary" size="lg" align="center" withArrow>
            {t('cta')}
          </CTA>
        </div>

      </Container>
    </PageLayout>
  );
}
