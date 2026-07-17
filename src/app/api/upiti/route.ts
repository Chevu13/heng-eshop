import { NextResponse } from 'next/server';
import { inquirySchema, sanitize, MAX_UPLOAD_BYTES, ALLOWED_UPLOAD_TYPES } from '@/lib/validation';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { createAdminSupabase } from '@/lib/supabase/server';
import { notify } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, 'upit'), 3, 120_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Previše upita u kratkom roku. Pokušajte ponovo za ${limit.retryAfter} s.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtev.' }, { status: 400 });
  }

  const raw = {
    full_name: String(form.get('full_name') ?? ''),
    company: String(form.get('company') ?? ''),
    email: String(form.get('email') ?? ''),
    phone: String(form.get('phone') ?? ''),
    project_type: String(form.get('project_type') ?? ''),
    location: String(form.get('location') ?? ''),
    description: String(form.get('description') ?? ''),
    desired_products: String(form.get('desired_products') ?? ''),
    deadline: String(form.get('deadline') ?? ''),
    consent: form.get('consent') === 'on' || form.get('consent') === 'true',
    website: String(form.get('website') ?? ''),
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return NextResponse.json(
      { error: first?.message ?? 'Podaci nisu ispravni.', field: first?.path?.[0] },
      { status: 422 },
    );
  }
  const input = parsed.data;

  if (input.website) return NextResponse.json({ ok: true }, { status: 201 });

  const sb = createAdminSupabase();
  if (!sb) {
    return NextResponse.json(
      {
        error:
          'Slanje upita trenutno nije aktivno jer sajt nije povezan sa bazom. ' +
          'Pišite nam direktno na email iz podnožja strane.',
      },
      { status: 503 },
    );
  }

  // ----- Prilog (opciono) -----
  let attachmentUrl: string | null = null;
  const file = form.get('attachment');
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'Prilog je veći od 10 MB.', field: 'attachment' }, { status: 422 },
      );
    }
    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Dozvoljeni formati priloga: JPG, PNG, WEBP i PDF.', field: 'attachment' },
        { status: 422 },
      );
    }
    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? 'bin';
    const path = `upiti/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await sb.storage
      .from('heng-uploads')
      .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (upErr) {
      console.error('[upiti] upload priloga nije uspeo', upErr);
      return NextResponse.json({ error: 'Prilog nije sačuvan. Pokušajte bez priloga.' }, { status: 500 });
    }
    attachmentUrl = path;
  }

  const { error } = await sb.from('project_inquiries').insert({
    full_name: sanitize(input.full_name, 120),
    company: input.company ? sanitize(input.company, 120) : null,
    email: sanitize(input.email, 160).toLowerCase(),
    phone: input.phone ? sanitize(input.phone, 30) : null,
    project_type: input.project_type ? sanitize(input.project_type, 80) : null,
    location: input.location ? sanitize(input.location, 120) : null,
    description: sanitize(input.description, 4000),
    desired_products: input.desired_products ? sanitize(input.desired_products, 500) : null,
    deadline: input.deadline ? sanitize(input.deadline, 80) : null,
    attachment_url: attachmentUrl,
    consent: true,
  });

  if (error) {
    console.error('[upiti] upis nije uspeo', error);
    return NextResponse.json({ error: 'Upit nije sačuvan. Pokušajte ponovo.' }, { status: 500 });
  }

  await notify(
    `Nov projektni upit — ${input.full_name}`,
    `${input.company ?? '—'} · ${input.email}\n\n${input.description}`,
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
