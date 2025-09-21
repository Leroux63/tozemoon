// src/app/[locale]/page.tsx
import { ArrowRight, Blocks, Code2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ProjectCard } from '@/components/ProjectCard';
import { SkillPills } from '@/components/SkillPills';
import { web2Skills, web3Skills } from '@/lib/skills';
import PageLayout from '@/components/PageLayout';
import { LIVE_URLS } from '@/lib/links';
import ContactForm from '@/components/ContactForm';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero3DClient from '@/components/hero/Hero3DClient';
import { routing, type AppLocale } from '@/i18n/routing';

// --- type guard
function isAppLocale(l: string): l is AppLocale {
  return (routing.locales as readonly string[]).includes(l);
}

type Props = { params: Promise<{ locale: string }> };

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    // on peut décider de fallback sur defaultLocale si tu préfères
    // return redirect({ href: '/', locale: routing.defaultLocale }); // si tu utilises next-intl/navigation
    throw new Error('Unsupported locale');
  }
  const typed = locale as AppLocale;

  setRequestLocale(typed);
  // Après setRequestLocale, tu peux appeler sans passer locale :
  const t = await getTranslations();

  return (
    <PageLayout>
      <div>
        {/* HERO */}
        <section className="pb-10">
          <Container className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/10 text-[#66D1D8]">
                {t('Hero.role')}
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
                {t('Hero.title.part1')}{' '}
                <span className="text-[var(--lunar)]">{t('Hero.title.part2')}</span>{' '}
                {t('Hero.title.part3')}{' '}
                <span style={{ color: 'var(--orange)' }}>{t('Hero.title.part4')}</span>.
              </h1>
              <p className="mt-4 text-base md:text-lg opacity-90">{t('Hero.subtitle')}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="rounded-2xl" asChild>
                  <a href="#contact">
                    {t('Hero.cta1')} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button className="rounded-2xl" variant="outline" asChild>
                  <a href="#projects">{t('Hero.cta2')}</a>
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <span>{t('Hero.badge1')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{t('Hero.badge2')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-2xl aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                <Hero3DClient />
              </div>
            </div>
          </Container>
        </section>

        {/* SERVICES */}
        <Container>
          <Section id="services" title={t('Services.title')} kicker={t('Services.kicker')}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Blocks className="h-5 w-5" />,
                  title: t('Services.cards.web3.title'),
                  points: [t('Services.cards.web3.p1'), t('Services.cards.web3.p2'), t('Services.cards.web3.p3')]
                },
                {
                  icon: <Code2 className="h-5 w-5" />,
                  title: t('Services.cards.web2.title'),
                  points: [t('Services.cards.web2.p1'), t('Services.cards.web2.p2'), t('Services.cards.web2.p3')]
                },
                {
                  icon: <Wrench className="h-5 w-5" />,
                  title: t('Services.cards.ds.title'),
                  points: [t('Services.cards.ds.p1'), t('Services.cards.ds.p2'), t('Services.cards.ds.p3')]
                }
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.06] rounded-2xl border border-white/10">
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-400/10">{s.icon}</div>
                      <div className="text-white font-semibold">{s.title}</div>
                    </div>
                    <ul className="mt-3 space-y-2 opacity-90 text-sm">
                      {s.points.map((p, idx) => (
                        <li key={idx}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </Container>

        {/* SKILLS */}
        <Container>
          <Section id="skills" title={t('Skills.title')} kicker={t('Skills.kicker')}>
            <div className="grid md:grid-cols-2 gap-6">
              <SkillPills title="Web3" items={web3Skills} />
              <SkillPills title="Web2" items={web2Skills} />
            </div>
          </Section>
        </Container>

        {/* PROJECTS */}
        <Container>
          <Section id="projects" title={t('Projects.title')} kicker={t('Projects.kicker')}>
            <div className="grid md:grid-cols-3 gap-6">
              <ProjectCard
                name="Aivy (Web3)"
                summary={t('Projects.aivy.summary')}
                tags={['Solana', 'Anchor', 'Solana Agent Kit', 'OpenAI']}
                slug="aivy"
                hrefLive={LIVE_URLS.aivy}
              />
              <ProjectCard
                name="MetaFlow (Web3)"
                summary={t('Projects.metaflow.summary')}
                tags={['USDC (SPL)', 'Subscriptions', 'PPV/Live']}
                slug="metaflow"
              />
              <ProjectCard
                name="SunSaver (Web2)"
                summary={t('Projects.sunsaver.summary')}
                tags={['Jakarta EE', 'Spring Boot', 'Thymeleaf', 'PayPal']}
                slug="sunsaver"
                hrefLive={LIVE_URLS.sunsaver}
              />
            </div>
            <p className="mt-6 text-sm opacity-75">{t('Projects.note')}</p>
          </Section>
        </Container>

        {/* ABOUT */}
        <Container>
          <Section id="about" title={t('About.title')} kicker={t('About.kicker')}>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-3 opacity-90">
                <p>{t('About.p1')}</p>
                <p>{t('About.p2')}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-sm font-medium mb-2">{t('About.modes.title')}</div>
                <ul className="text-sm opacity-90 space-y-1">
                  <li>• {t('About.modes.m1')}</li>
                  <li>• {t('About.modes.m2')}</li>
                  <li>• {t('About.modes.m3')}</li>
                </ul>
              </div>
            </div>
          </Section>
        </Container>

        {/* CONTACT */}
        <Container>
          <Section id="contact" title={t('Contact.title')} kicker={t('Contact.kicker')}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="opacity-90">{t('Contact.p1')}</p>
                <ul className="list-disc ml-5 opacity-90">
                  <li>{t('Contact.li1')}</li>
                  <li>{t('Contact.li2')}</li>
                  <li>{t('Contact.li3')}</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <ContactForm />
              </div>
            </div>
          </Section>
        </Container>
      </div>
    </PageLayout>
  );
}
