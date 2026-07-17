'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { TextField, TextAreaField, Honeypot } from './Field';
import { formatRsd, paymentLabel, CENA_NA_UPIT } from '@/lib/format';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { PaymentMethod } from '@/types';

export function CheckoutForm({
  deliveryCost, freeThreshold, paymentMethods,
}: { deliveryCost: number; freeThreshold: number | null; paymentMethods: PaymentMethod[] }) {
  const { lines, subtotal, hasRequestItems, clear, ready } = useCart();
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentMethod>(paymentMethods[0] ?? 'pouzecem');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <Skeleton className="h-96 w-full" />;

  if (!lines.length) {
    return (
      <EmptyState
        title="Korpa je prazna"
        description="Dodajte proizvod iz kolekcije da biste nastavili sa poručivanjem."
        actionLabel="Pogledaj kolekciju"
        actionHref="/kolekcija"
      />
    );
  }

  const freeDelivery = freeThreshold !== null && subtotal >= freeThreshold;
  const delivery = freeDelivery ? 0 : deliveryCost;
  const total = subtotal + delivery;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get('full_name') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      email: String(fd.get('email') ?? ''),
      address: String(fd.get('address') ?? ''),
      city: String(fd.get('city') ?? ''),
      postal_code: String(fd.get('postal_code') ?? ''),
      note: String(fd.get('note') ?? ''),
      website: String(fd.get('website') ?? ''),
      payment,
      items: lines.map((l) => ({
        productId: l.productId,
        variantId: l.variantId,
        quantity: l.quantity,
      })),
    };

    try {
      const res = await fetch('/api/porudzbine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.field) setErrors({ [String(data.field)]: data.error });
        setFormError(data.error ?? 'Porudžbina nije poslata.');
        setBusy(false);
        return;
      }

      clear();
      router.push(`/porudzbina-uspesna?ref=${encodeURIComponent(data.reference)}`);
    } catch {
      setFormError('Veza sa serverom nije uspostavljena. Pokušajte ponovo.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      <Honeypot />

      <div className="lg:col-span-7">
        <h2 className="font-display text-[20px]" style={{ fontWeight: 600 }}>Podaci za isporuku</h2>
        <div className="heng-rule my-6" />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextField label="Ime i prezime" name="full_name" required autoComplete="name" error={errors.full_name} />
          </div>
          <TextField label="Telefon" name="phone" type="tel" required autoComplete="tel" error={errors.phone} />
          <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
          <div className="sm:col-span-2">
            <TextField label="Adresa" name="address" required autoComplete="street-address" error={errors.address} />
          </div>
          <TextField label="Grad" name="city" required autoComplete="address-level2" error={errors.city} />
          <TextField
            label="Poštanski broj" name="postal_code" required inputMode="numeric"
            autoComplete="postal-code" error={errors.postal_code}
          />
          <div className="sm:col-span-2">
            <TextAreaField
              label="Napomena" name="note" rows={4}
              hint="Sprat, interfon, željeni termin isporuke ili detalji o postavci."
              error={errors.note}
            />
          </div>
        </div>

        <h2 className="mt-12 font-display text-[20px]" style={{ fontWeight: 600 }}>Način plaćanja</h2>
        <div className="heng-rule my-6" />

        <fieldset>
          <legend className="sr-only">Način plaćanja</legend>
          <div className="space-y-3">
            {paymentMethods.map((m) => (
              <label
                key={m}
                className="flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors duration-200"
                style={{ borderColor: payment === m ? 'var(--color-gold)' : 'rgba(28,20,22,0.15)' }}
              >
                <input
                  type="radio" name="payment" value={m}
                  checked={payment === m}
                  onChange={() => setPayment(m)}
                  className="mt-1 accent-[color:var(--color-maroon)]"
                />
                <span>
                  <span className="block font-body text-[15px]">{paymentLabel(m)}</span>
                  <span className="mt-1 block font-body text-[13px] text-ink/55">
                    {m === 'pouzecem'
                      ? 'Iznos se izmiruje kuriru pri preuzimanju pošiljke.'
                      : 'Šaljemo predračun na email; isporuka sledi nakon uplate.'}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="lg:col-span-5">
        <div className="border border-ink/12 p-7 lg:sticky lg:top-28">
          <h2 className="font-display text-[20px]" style={{ fontWeight: 600 }}>Vaša porudžbina</h2>
          <div className="heng-rule my-6" />

          <ul className="space-y-4">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.variantId}`} className="flex justify-between gap-4">
                <span className="min-w-0 font-body text-[14px]">
                  <span className="block truncate">{l.name}</span>
                  <span className="block font-body text-[12px] text-ink/50">
                    {l.finishName ? `${l.finishName} · ` : ''}{l.quantity} kom.
                  </span>
                </span>
                <span className="shrink-0 font-body text-[14px]">
                  {l.unitPrice === null ? CENA_NA_UPIT : formatRsd(l.unitPrice * l.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="heng-rule my-6" />

          <dl className="space-y-3 font-body text-[14px]">
            <div className="flex justify-between">
              <dt className="text-ink/60">Međuzbir</dt><dd>{formatRsd(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Dostava</dt>
              <dd>{delivery === 0 ? 'Bez naknade' : formatRsd(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/12 pt-3">
              <dt className="heng-eyebrow text-ink/55">Ukupno</dt>
              <dd className="font-display text-[20px]" style={{ fontWeight: 600 }}>{formatRsd(total)}</dd>
            </div>
          </dl>

          {hasRequestItems && (
            <p
              className="mt-5 border-l-2 pl-3 font-body text-[13px] leading-relaxed text-ink/58"
              style={{ borderColor: 'var(--color-gold)' }}
            >
              Korpa sadrži stavke sa cenom na upit — te stavke ne ulaze u prikazani zbir. Javljamo se
              sa ponudom pre isporuke.
            </p>
          )}

          {formError && (
            <p className="mt-5 rounded-sm p-3 font-body text-[13px]" role="alert"
               style={{ background: 'rgba(198,23,143,0.08)', color: 'var(--color-magenta)' }}>
              {formError}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full">
            {busy ? 'Slanje…' : 'Pošalji porudžbinu'}
          </button>

          <p className="mt-4 font-body text-[12px] leading-relaxed text-ink/45">
            Slanjem porudžbine potvrđujete{' '}
            <Link href="/uslovi-koriscenja" className="link-gold">uslove korišćenja</Link> i{' '}
            <Link href="/politika-privatnosti" className="link-gold">politiku privatnosti</Link>.
          </p>
        </div>
      </aside>
    </form>
  );
}
