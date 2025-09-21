// components/case.tsx
'use client';

import React from 'react';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs px-2 py-1 rounded-xl bg-white/10 mr-2 mt-2">
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {hint ? <div className="text-xs opacity-60 mt-1">{hint}</div> : null}
    </div>
  );
}

type CTAProps = {
  /** Only required when asChild = false (default). */
  href?: string;
  /** When true, CTA won’t render an <a>; it will pass its styles to its child (e.g. your i18n <Link/>). */
  asChild?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  align?: 'left' | 'center' | 'right';
  size?: 'md' | 'lg';
  withArrow?: boolean;
  className?: string;
};

export function CTA({
  href,
  asChild = false,
  children,
  variant = 'primary',
  align = 'center',
  size = 'lg',
  withArrow = true,
  className
}: CTAProps) {
  const sizes = {
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  } as const;

  const variants = {
    primary:
      'bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400 text-black ' +
      'shadow-[0_8px_24px_rgba(255,153,0,.35)] hover:shadow-[0_10px_32px_rgba(255,153,0,.55)] ' +
      'active:shadow-[0_6px_18px_rgba(255,153,0,.35)]',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border border-white/30 text-white hover:bg-white/10'
  } as const;

  const display = align === 'left' ? 'inline-flex' : 'flex';
  const alignClass =
    align === 'center' ? 'mx-auto w-fit' :
    align === 'right'  ? 'ml-auto w-fit' :
                         '';

  const classes = clsx(
    'group items-center justify-center gap-2 rounded-2xl font-semibold',
    'transition-all duration-200 will-change-transform',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-300 focus-visible:ring-offset-black',
    'active:translate-y-[1px]',
    display,
    sizes[size],
    variants[variant],
    alignClass,
    className
  );

  const Content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <ArrowRight className="h-5 w-5 translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  // asChild=true → pass classes to child (e.g. i18n Link)
  if (asChild) {
    return (
      <div className={align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : undefined}>
        <Slot className={classes}>{Content}</Slot>
      </div>
    );
  }

  // Default: render a normal <a> (needs href)
  return (
    <a href={href} role="button" className={classes}>
      {Content}
    </a>
  );
}
