import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Si tu postes via <form>, utilise req.formData()
  // Si tu postes en JSON via fetch, utilise req.json()
  let name = '';
  let email = '';
  let message = '';

  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      name = body.name || '';
      email = body.email || '';
      message = body.message || '';
    } else {
      const form = await req.formData();
      name = String(form.get('name') || '');
      email = String(form.get('email') || '');
      message = String(form.get('message') || '');
    }
  } catch {}

  // TODO: branche Resend / Slack webhook / Email provider
  // console.log({ name, email, message });

  return NextResponse.json({ ok: true });
}