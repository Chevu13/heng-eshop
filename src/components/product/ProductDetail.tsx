'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ProductFull } from '@/types';
import { ProductGallery } from './ProductGallery';
import { FinishSwatch } from './FinishSwatch';
import { Accordion } from './Accordion';
import { useCart } from '@/components/cart/CartProvider';
import { resolvePrice, stockFor } from '@/lib/pricing';
import { formatRsd, CENA_NA_UPIT } from '@/lib/format';

export function ProductDetail({ product }: { product: ProductFull }) {
  const variants = product.variants.filter((v) => v.is_active);
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  const variant = variants[variantIdx] ?? null;
  const price = resolvePrice(product, variant);
  const stock = stockFor(product, variant);
  const sku = variant?.sku ?? product.sku;
  const dimensions = variant?.dimensions ?? product.dimensions;

  // Fotografije varijante idu prve, ostali mediji zadržavaju svoj redosled.
  const media = useMemo(() => {
    if (!variant) return product.media;
    const own = product.media.filter((m) => m.variant_id === variant.id);
    const rest = product.media.filter((m) => m.variant_id !== variant.id && !m.variant_id);
    return [...own, ...rest];
  }, [product.media, variant]);

  const details = [
    product.description && { title: 'Opis', body: product.description },
    product.technical_info && { title: 'Tehničke informacije', body: product.technical_info },
    product.installation_info && { title: 'Montaža', body: product.installation_info },
    product.delivery_info && { title: 'Isporuka', body: product.delivery_info },
  ].filter(Boolean) as { title: string; body: string }[];

  function addToCart() {
    add({
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      finishName: variant?.finish_name ?? null,
      sku: sku ?? null,
      image: media[0]?.url ?? null,
      unitPrice: price.effective,
      quantity: qty,
    });
  }

  const stockLabel = price.onRequest
    ? 'Dostupnost se potvrđuje pri upitu'
    : stock > 0
      ? `Na stanju — ${stock} kom.`
      : 'Trenutno nije na stanju';

  return (
    <>
      <section className="bg-ivory-2 pb-24">
        <div className="heng-container">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <ProductGallery
                media={media}
                activeUrl={variant?.main_image ?? null}
                productName={product.name}
              />
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                {product.category && (
                  <Link
                    href={`/kolekcija/${product.category.slug}`}
                    className="heng-eyebrow link-gold"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    {product.category.title}
                  </Link>
                )}

                <h1
                  className="mt-4 font-display text-[clamp(1.8rem,4vw,2.4rem)] leading-[1.1]"
                  style={{ fontWeight: 700, letterSpacing: '-0.015em' }}
                >
                  {product.name}
                </h1>

                <div className="mt-4 flex items-baseline gap-3">
                  {price.onRequest ? (
                    <span className="font-display text-[22px]" style={{ fontWeight: 600 }}>
                      {CENA_NA_UPIT}
                    </span>
                  ) : (
                    <>
                      <span
                        className="font-display text-[24px]"
                        style={{ fontWeight: 600, color: price.sale !== null ? 'var(--color-magenta)' : undefined }}
                      >
                        {formatRsd(price.effective)}
                      </span>
                      {price.sale !== null && (
                        <span className="font-body text-[15px] text-ink/40 line-through">
                          {formatRsd(price.regular)}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {product.short_description && (
                  <p className="mt-5 font-body text-[15px] leading-[1.7] text-ink/68">
                    {product.short_description}
                  </p>
                )}

                <div className="heng-rule my-8" />

                {variants.length > 0 && (
                  <div>
                    <p className="field-label">
                      Završna obrada
                      <span className="ml-2 normal-case tracking-normal text-ink/45">
                        {variant?.finish_name}
                      </span>
                    </p>
                    <div
                      className="grid gap-3 sm:gap-5"
                      style={{ gridTemplateColumns: `repeat(${Math.min(variants.length, 4)}, minmax(0, 1fr))` }}
                      role="group"
                      aria-label="Izbor završne obrade"
                    >
                      {variants.map((v, i) => (
                        <FinishSwatch
                          key={v.id}
                          name={v.finish_name}
                          color={v.finish_swatch ?? '#8C8477'}
                          selected={i === variantIdx}
                          onSelect={() => setVariantIdx(i)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
                  {sku && (
                    <div>
                      <dt className="field-label mb-1">Šifra</dt>
                      <dd className="font-body text-[14px] text-ink/75">{sku}</dd>
                    </div>
                  )}
                  {dimensions && (
                    <div>
                      <dt className="field-label mb-1">Dimenzije</dt>
                      <dd className="font-body text-[14px] tabular-nums text-ink/75">{dimensions}</dd>
                    </div>
                  )}
                  {product.material && (
                    <div className="col-span-2">
                      <dt className="field-label mb-1">Materijal</dt>
                      <dd className="font-body text-[14px] text-ink/75">{product.material}</dd>
                    </div>
                  )}
                </dl>

                <p
                  className="mt-6 flex items-center gap-2 font-body text-[13px]"
                  style={{ color: stock > 0 && !price.onRequest ? 'var(--color-ink)' : 'rgba(28,20,22,0.55)' }}
                  aria-live="polite"
                >
                  <span
                    aria-hidden="true"
                    className="block h-1.5 w-1.5 rounded-pill"
                    style={{ background: stock > 0 && !price.onRequest ? 'var(--color-gold)' : 'rgba(28,20,22,0.3)' }}
                  />
                  {stockLabel}
                </p>

                <div className="mt-7 flex flex-wrap items-stretch gap-3">
                  <div className="flex items-center rounded-sm border border-ink/16">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-4 py-3 font-body text-[15px] hover:text-maroon"
                      aria-label="Smanji količinu"
                    >−</button>
                    <span className="min-w-[34px] text-center font-body text-[14px] tabular-nums" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(99, q + 1))}
                      className="px-4 py-3 font-body text-[15px] hover:text-maroon"
                      aria-label="Povećaj količinu"
                    >+</button>
                  </div>

                  <button onClick={addToCart} className="btn btn-primary flex-1">
                    Dodaj u korpu
                  </button>
                </div>

                <Link
                  href={`/kontakt?proizvod=${encodeURIComponent(product.name)}`}
                  className="btn btn-outline mt-3 w-full"
                >
                  Zatraži informacije
                </Link>

                {price.onRequest && (
                  <p className="mt-4 font-body text-[13px] leading-relaxed text-ink/52">
                    Cena za ovaj model se formira prema količini i obradi. Dodajte proizvod u korpu i
                    pošaljite porudžbinu — javljamo se sa ponudom pre isporuke.
                  </p>
                )}

                {details.length > 0 && (
                  <div className="mt-10">
                    <Accordion items={details} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobilna lepljiva akcija */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-ivory-2/96 px-4 py-3 lg:hidden"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-body text-[12px] text-ink/50">
              {product.name}{variant ? ` — ${variant.finish_name}` : ''}
            </p>
            <p className="font-display text-[15px]" style={{ fontWeight: 600 }}>
              {price.onRequest ? CENA_NA_UPIT : formatRsd(price.effective)}
            </p>
          </div>
          <button onClick={addToCart} className="btn btn-primary shrink-0" style={{ padding: '13px 20px' }}>
            Dodaj u korpu
          </button>
        </div>
      </div>
      <div aria-hidden="true" className="h-[76px] lg:hidden" />
    </>
  );
}
