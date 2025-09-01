'use client';

import { Button } from '@/components/ui/button';
import TMLogo from '@/components/TMLogo';
import { Container } from '@/components/Container';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export function Header() {
  const tNav = useTranslations('Nav');

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-black/10">
      <Container className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TMLogo className="h-18 w-18" />
          <span className="hidden md:block font-medium tracking-wide text-[#66D1D8]">ToZeMoon Labs</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#services" className="opacity-80 hover:opacity-100">{tNav('services')}</a>
          <a href="#skills"   className="opacity-80 hover:opacity-100">{tNav('skills')}</a>
          <a href="#projects" className="opacity-80 hover:opacity-100">{tNav('projects')}</a>
          <a href="#about"    className="opacity-80 hover:opacity-100">{tNav('about')}</a>
          <a href="#contact"  className="opacity-80 hover:opacity-100">{tNav('contact')}</a>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Button className="rounded-2xl" asChild>
            <Link href="#contact">{tNav('cta')}</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
