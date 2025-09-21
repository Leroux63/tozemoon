// app/[locale]/projects/sunsaver/page.tsx
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

export default async function SunSaverPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Cases.SunSaver');
  const tc = await getTranslations('Common');

  return (
    <PageLayout title={t('title')} showLinks={false}>
      <Container>

        {/* Back link */}
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

        {/* Tech pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>Jakarta EE</Pill><Pill>Spring</Pill><Pill>Thymeleaf</Pill>
          <Pill>PayPal Developer</Pill><Pill>Role-based access</Pill>
        </div>

        {/* Stats (placeholders éditables dans i18n) */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Stat label={t('stats.mvp.label')} value={t('stats.mvp.value')} hint={t('stats.mvp.hint')} />
          <Stat label={t('stats.booking.label')} value={t('stats.booking.value')} hint={t('stats.booking.hint')} />
          <Stat label={t('stats.payment.label')} value={t('stats.payment.value')} hint={t('stats.payment.hint')} />
        </div>

        {/* Gallery : cover + plage + concession + réservation */}
        <div className="mt-10">
          <Gallery
            aspect="16/9"
            fit="contain"
            showCaptions
            images={[
              { src: '/projects/sunsaver/beach.png', alt: 'Beach detail', title: t('gallery.beach') },
              { src: '/projects/sunsaver/concession.png', alt: 'Concession detail', title: t('gallery.concession') },
              { src: '/projects/sunsaver/booking.png', alt: 'Booking flow', title: t('gallery.booking') }
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
