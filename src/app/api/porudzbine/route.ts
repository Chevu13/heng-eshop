import { NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validation';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { OrderError, priceOrder } from '@/lib/orders';
import { createAdminSupabase } from '@/lib/supabase/server';
import { getSettings } from '@/lib/data/repository';
import { orderReference, formatRsd } from '@/lib/format';
import { notify } from '@/lib/mail';
import { sanitize } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, 'porudzbina'), 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Previše pokušaja. Pokušajte ponovo za ${limit.retryAfter} s.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtev.' }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return NextResponse.json(
      { error: first?.message ?? 'Podaci nisu ispravni.', field: first?.path?.[0] },
      { status: 422 },
    );
  }
  const input = parsed.data;

  // Honeypot — tiho prihvatanje bez upisa.
  if (input.website) return NextResponse.json({ reference: orderReference() }, { status: 201 });

  const settings = await getSettings();
  if (!settings.payment_methods.includes(input.payment)) {
    return NextResponse.json({ error: 'Izabrani način plaćanja nije dostupan.' }, { status: 422 });
  }

  let priced;
  try {
    priced = await priceOrder(input, settings);
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error('[porudzbine] neuspelo formiranje cene', err);
    return NextResponse.json({ error: 'Došlo je do greške. Pokušajte ponovo.' }, { status: 500 });
  }

  const reference = orderReference();
  const sb = createAdminSupabase();

  if (!sb) {
    // Demo režim bez baze — porudžbina se ne upisuje, korisnik dobija jasnu poruku.
    return NextResponse.json(
      {
        error:
          'Poručivanje trenutno nije aktivno jer prodavnica nije povezana sa bazom. ' +
          'Kontaktirajte nas direktno i porudžbinu evidentiramo ručno.',
      },
      { status: 503 },
    );
  }

  const { data: order, error } = await sb
    .from('orders')
    .insert({
      reference,
      full_name: sanitize(input.full_name, 120),
      phone: sanitize(input.phone, 30),
      email: sanitize(input.email, 160).toLowerCase(),
      address: sanitize(input.address, 240),
      city: sanitize(input.city, 80),
      postal_code: sanitize(input.postal_code, 10),
      note: input.note ? sanitize(input.note, 1000) : null,
      payment: input.payment,
      subtotal_rsd: priced.subtotal,
      delivery_rsd: priced.delivery,
      total_rsd: priced.total,
      has_request_items: priced.hasRequestItems,
    })
    .select('id, reference')
    .single();

  if (error || !order) {
    console.error('[porudzbine] upis nije uspeo', error);
    return NextResponse.json({ error: 'Porudžbina nije sačuvana. Pokušajte ponovo.' }, { status: 500 });
  }

  const { error: itemsError } = await sb.from('order_items').insert(
    priced.items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      variant_id: i.variantId,
      product_name: i.productName,
      finish_name: i.finishName,
      sku: i.sku,
      unit_price_rsd: i.unitPrice,
      quantity: i.quantity,
      line_total_rsd: i.lineTotal,
    })),
  );

  if (itemsError) {
    // Bez stavki porudžbina nema smisla — uklanjamo zaglavlje.
    await sb.from('orders').delete().eq('id', order.id);
    console.error('[porudzbine] upis stavki nije uspeo', itemsError);
    return NextResponse.json({ error: 'Porudžbina nije sačuvana. Pokušajte ponovo.' }, { status: 500 });
  }

  await notify(
    `Nova porudžbina ${order.reference}`,
    `${input.full_name} · ${input.phone}\nUkupno: ${formatRsd(priced.total)}` +
      (priced.hasRequestItems ? '\nSadrži stavke sa cenom na upit.' : ''),
  );

  return NextResponse.json({ reference: order.reference }, { status: 201 });
}
