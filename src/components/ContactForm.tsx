'use client';

import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

// Charge uniquement côté client (pas de SSR)
const HCaptcha = dynamic(() => import('@hcaptcha/react-hcaptcha'), { ssr: false });

export default function ContactForm() {
  const t = useTranslations('Contact.form');

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0); // ← sert à "reset" le widget
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const hardResetCaptcha = useCallback(() => {
    setCaptchaToken('');
    setCaptchaKey((k) => k + 1); // ← remonte un nouveau composant => reset
  }, []);

  const handleVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  const handleExpire = useCallback(() => {
    setCaptchaToken('');
  }, []);

  const handleError = useCallback(() => {
    setToast({ type: 'error', msg: t('toast.network') });
    hardResetCaptcha();
  }, [hardResetCaptcha, t]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setToast(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    formData.set('h-captcha-response', captchaToken || '');

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      setToast({ type: 'error', msg: t('toast.required') });
      return;
    }
    if (!captchaToken) {
      setToast({ type: 'error', msg: t('toast.captcha') });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/contact', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || !data?.ok) {
        const err = data?.error || 'generic';
        setToast({
          type: 'error',
          msg:
            err === 'captcha_failed' ? t('toast.captcha') :
            err === 'invalid_email'  ? t('toast.email')   :
            err === 'missing_fields' ? t('toast.required') :
            err === 'captcha_error'  ? t('toast.network')  :
                                       t('toast.generic')
        });
        hardResetCaptcha();
        return;
      }

      setToast({ type: 'success', msg: t('toast.success') });
      formRef.current?.reset();
      hardResetCaptcha();
    } catch {
      setToast({ type: 'error', msg: t('toast.network') });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      {toast && (
        <div className="flex justify-center mb-3">
          <div
            role="status"
            aria-live="polite"
            className={`inline-flex max-w-[560px] w-full justify-center rounded-xl px-3 py-2 text-sm text-center ${
              toast.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
                : 'bg-red-500/15 text-red-200 border border-red-500/30'
            }`}
          >
            {toast.msg}
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 text-sm" noValidate>
        <input type="text" name="_company" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="relative">
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder=" "
            className="peer bg-transparent border rounded-xl px-3 pt-5 pb-2 border-white/20 w-full
                       focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/30 outline-none"
            required
          />
          <label
            htmlFor="contact-name"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2
                       px-1 text-sm text-gray-400 bg-white/5 transition-all duration-150
                       peer-focus:top-2 peer-focus:text-xs
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm
                       peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
          >
            {t('name')}
          </label>
        </div>

        <div className="relative">
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder=" "
            className="peer bg-transparent border rounded-xl px-3 pt-5 pb-2 border-white/20 w-full
                       focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/30 outline-none"
            required
          />
          <label
            htmlFor="contact-email"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2
                       px-1 text-sm text-gray-400 bg-white/5 transition-all duration-150
                       peer-focus:top-2 peer-focus:text-xs
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm
                       peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
          >
            {t('email')}
          </label>
        </div>

        <div className="relative">
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            placeholder=" "
            className="peer bg-transparent border rounded-xl px-3 pt-6 pb-2 border-white/20 w-full
                       focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/30 outline-none resize-vertical"
            required
          />
          <label
            htmlFor="contact-message"
            className="pointer-events-none absolute left-3 top-3
                       px-1 text-sm text-gray-400 bg-white/5 transition-all duration-150
                       peer-focus:top-2 peer-focus:text-xs
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                       peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
          >
            {t('message')}
          </label>
        </div>

        {/* hCaptcha (sans ref) */}
        <div className="mt-1">
          <HCaptcha
            key={captchaKey}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={handleVerify}
            onExpire={handleExpire}
            onError={handleError}
            theme="dark"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="rounded-2xl font-semibold px-7 py-3.5 text-black
                     bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400
                     shadow-[0_8px_24px_rgba(255,153,0,.35)]
                     hover:shadow-[0_10px_32px_rgba(255,153,0,.55)]
                     active:translate-y-[1px]"
        >
          {loading ? t('sending') : t('submit')}
        </Button>

        <p className="mt-1 text-xs opacity-60">{t('note')}</p>
      </form>
    </div>
  );
}
