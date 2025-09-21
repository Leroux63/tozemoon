import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing, type AppLocale } from '@/i18n/routing';
import PageLayout from '@/components/PageLayout';
import { Container } from '@/components/Container';
import { Pill, Stat, CTA } from '@/components/case';
import Gallery from '@/components/Gallery';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

// ✅ SSG par locale
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

function isAppLocale(l: string): l is AppLocale {
    return (routing.locales as readonly string[]).includes(l);
}

type Props = { params: Promise<{ locale: string }> };
export const dynamic = 'force-static';

export default async function SunSaverPage({ params }: Props) {
    const { locale } = await params;
    if (!isAppLocale(locale)) throw new Error('Unsupported locale');
    const typed = locale as AppLocale;

    setRequestLocale(typed);

    // ✅ messages localisés explicites
    const t = await getTranslations({ locale: typed, namespace: 'Cases.SunSaver' });
    const tc = await getTranslations({ locale: typed, namespace: 'Common' });

    return (
        <PageLayout title={t('title')} showLinks={false}>
            <Container>
                {/* Retour */}
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
                    <Pill>Jakarta EE</Pill><Pill>Spring Boot</Pill><Pill>Thymeleaf</Pill>
                    <Pill>PayPal Developer</Pill><Pill>RBAC</Pill>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-8">
                    <Stat label={t('stats.mvp.label')} value={t('stats.mvp.value')} hint={t('stats.mvp.hint')} />
                    <Stat label={t('stats.booking.label')} value={t('stats.booking.value')} hint={t('stats.booking.hint')} />
                    <Stat label={t('stats.payment.label')} value={t('stats.payment.value')} hint={t('stats.payment.hint')} />
                </div>

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

                {/* CTA — Link i18n + hash */}
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
