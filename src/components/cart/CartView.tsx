'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { formatRsd, CENA_NA_UPIT } from '@/lib/format';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export function CartView({ deliveryCost, freeThreshold }: {
  deliveryCost: number; freeThreshold: number | null;
}) {
  const { lines, subtotal, hasRequestItems, setQuantity, remove, ready } = useCart();

  if (!ready) {
    return (
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {[0, 1].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full lg:col-span-4" />
      </div>
    );
  }

  if (!lines.length) {
    return (
      <EmptyState
        title="Korpa je prazna"
        description="Izaberite model iz kolekcije ili nam pošaljite upit za postavku po meri."
        actionLabel="Pogledaj kolekciju"
        actionHref="/kolekcija"
      />
    );
  }

  const freeDelivery = freeThreshold !== null && subtotal >= freeThreshold;
  const delivery = freeDelivery ? 0 : deliveryCost;
  const total = subtotal + delivery;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-8">
        <ul className="border-t border-ink/12">
          {lines.map((l) => (
            <li key={`${l.productId}-${l.variantId}`} className="flex gap-5 border-b border-ink/12 py-7">
              <Link
                href={`/proizvod/${l.slug}`}
                className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-ivory sm:h-36 sm:w-28"
              >
                {l.image && (
                  <Image src={l.image} alt={l.name} fill sizes="112px" className="object-cover" />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div>
                  <h2 className="font-display text-[18px]" style={{ fontWeight: 600 }}>
                    <Link href={`/proizvod/${l.slug}`} className="link-gold">{l.name}</Link>
                  </h2>
                  {l.finishName && (
                    <p className="mt-1 font-body text-[13px] text-ink/55">{l.finishName}</p>
                  )}
                  {l.sku && <p className="mt-0.5 font-body text-[12px] text-ink/40">{l.sku}</p>}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center rounded-sm border border-ink/16">
                    <button
                      onClick={() => setQuantity(l.productId, l.variantId, l.quantity - 1)}
                      className="px-3 py-2 font-body text-[14px] hover:text-maroon"
                      aria-label={`Smanji količinu za ${l.name}`}
                    >−</button>
                    <span className="min-w-[32px] text-center font-body text-[13px] tabular-nums">
                      {l.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(l.productId, l.variantId, l.quantity + 1)}
                      className="px-3 py-2 font-body text-[14px] hover:text-maroon"
                      aria-label={`Povećaj količinu za ${l.name}`}
                    >+</button>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-display text-[16px]" style={{ fontWeight: 600 }}>
                      {l.unitPrice === null ? CENA_NA_UPIT : formatRsd(l.unitPrice * l.quantity)}
                    </span>
                    <button
                      onClick={() => remove(l.productId, l.variantId)}
                      className="link-gold font-body text-[12px] uppercase tracking-eyebrow text-ink/45"
                    >
                      Ukloni
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link href="/kolekcija" className="link-gold mt-8 inline-block font-body text-[13px] uppercase tracking-eyebrow">
          Nastavi kupovinu
        </Link>
      </div>

      <aside className="lg:col-span-4">
        <div className="border border-ink/12 p-7 lg:sticky lg:top-28">
          <h2 className="font-display text-[20px]" style={{ fontWeight: 600 }}>Pregled</h2>
          <div className="heng-rule my-6" />

          <dl className="space-y-3 font-body text-[14px]">
            <div className="flex justify-between">
              <dt className="text-ink/60">Međuzbir</dt>
              <dd>{formatRsd(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Dostava</dt>
              <dd>{delivery === 0 ? 'Bez naknade' : formatRsd(delivery)}</dd>
            </div>
          </dl>

          {freeThreshold !== null && !freeDelivery && (
            <p className="mt-4 font-body text-[13px] text-ink/55">
              Još {formatRsd(freeThreshold - subtotal)} do besplatne dostave.
            </p>
          )}

          <div className="heng-rule my-6" />

          <div className="flex items-baseline justify-between">
            <span className="heng-eyebrow text-ink/55">Ukupno</span>
            <span className="font-display text-[24px]" style={{ fontWeight: 600 }}>
              {formatRsd(total)}
            </span>
          </div>

          {hasRequestItems && (
            <p className="mt-4 border-l-2 pl-3 font-body text-[13px] leading-relaxed text-ink/58"
               style={{ borderColor: 'var(--color-gold)' }}>
              Korpa sadrži stavke sa cenom na upit. Porudžbinu evidentiramo, a konačan iznos
              potvrđujemo pre isporuke.
            </p>
          )}

          <Link href="/porucivanje" className="btn btn-primary mt-7 w-full">
            Poručivanje
          </Link>
        </div>
      </aside>
    </div>
  );
}
