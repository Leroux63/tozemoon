// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function getIP(req: Request) {
  const xf = req.headers.get('x-forwarded-for') || '';
  return xf.split(',')[0]?.trim() || '0.0.0.0';
}

export async function POST(req: Request) {
  let name = '', email = '', message = '', honey = '', captchaToken = '';

  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await req.json();
      name = String(body.name || '');
      email = String(body.email || '');
      message = String(body.message || '');
      honey = String(body._company || '');
      captchaToken = String(body['h-captcha-response'] || body['hcaptcha'] || '');
    } else {
      const form = await req.formData();
      name = String(form.get('name') || '');
      email = String(form.get('email') || '');
      message = String(form.get('message') || '');
      honey = String(form.get('_company') || '');
      captchaToken = String(form.get('h-captcha-response') || '');
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  if (honey) return NextResponse.json({ ok: true }); // honeypot: STOP

  if (!name || !email || !message)
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });

  // ✅ Vérifie hCaptcha
  try {
    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET || '',
        response: captchaToken,
        sitekey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '',
        remoteip: getIP(req)
      })
    });
    const data = await res.json();
    if (!data.success) {
      return NextResponse.json({ ok: false, error: 'captcha_failed' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'captcha_error' }, { status: 500 });
  }

  // ✅ Envoi email via Resend (from = ton domaine, replyTo = user)
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || 'ToZeMoon Labs <onboarding@resend.dev>',
      to: process.env.RESEND_TO || 'contact@tozemoonlabs.com',
      subject: `Nouveau message — ${name}`,
      replyTo: email,
      text: `Nom: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
          <h2>Nouveau message du site</h2>
          <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <hr />
          <pre style="white-space:pre-wrap;font-size:14px;line-height:1.5">${escapeHtml(message)}</pre>
        </div>
      `
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
