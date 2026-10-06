'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ProductFull } from '@/types';
import { ProductGallery } from './ProductGallery';
import { Accordion } from './Accordion';
import { useCart } from '@/components/cart/CartProvider';
import { resolvePrice } from '@/lib/pricing';
import { formatRsd, CENA_NA_UPIT } from '@/lib/format';

export function ProductDetail({ product }: { product: ProductFull }) {
  const variants = product.variants.filter((v) => v.is_active);
  const [variantIdx, setVariantIdx] = useState(0);
  // ?obrada=zlatna (klik na kružić u katalogu) otvara tu obradu.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('obrada');
    const i = variants.findIndex((v) => v.finish_code === code);
    if (i > 0) setVariantIdx(i);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  const variant = variants[variantIdx] ?? null;
  const price = resolvePrice(product, variant);
  const sku = variant?.sku ?? product.sku;
  const dimensions = variant?.dimensions ?? product.dimensions;

  // Izabrana obrada: prvo njena glavna fotografija, pa ostale fotografije te
  // obrade, pa zajedničke. Fotografije drugih obrada se ne prikazuju.
  const media = useMemo(() => {
    if (!variant) return product.media;
    const own = product.media.filter((m) => m.variant_id === variant.id);
    const rest = product.media.filter((m) => !m.variant_id);
    const main = variant.main_image;
    if (!main) return [...own, ...rest];
    const inList = [...own, ...rest].find((m) => m.url === main);
    const first = inList ?? {
      id: `main-${variant.id}`, product_id: product.id, variant_id: variant.id, url: main,
      kind: 'image' as const, poster_url: null, alt: `${product.name} — ${variant.finish_name}`,
      is_cover: false, sort_order: -1,
    };
    return [first, ...[...own, ...rest].filter((m) => m !== first)];
  }, [product.id, product.name, product.media, variant]);

  const details = [
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

  return (
    <section className="bg-ivory-2 px-5 pb-24 pt-6 lg:px-10 lg:pt-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        {/* key: nova obrada = galerija kreće od prve (njene) fotografije. */}
        <ProductGallery key={variant?.id ?? 'bez-obrade'} media={media} productName={product.name} />

        <div>
          <div className="font-body lg:sticky lg:top-28">
            <nav aria-label="Putanja">
              <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink/55">
                <li><Link href="/kolekcija" className="hover:underline">Proizvodi</Link></li>
                {product.category && (
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true">›</span>
                    <Link href={`/kolekcija/${product.category.slug}`} className="hover:underline">{product.category.title}</Link>
                  </li>
                )}
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true">›</span>
                  <span aria-current="page">{product.name}</span>
                </li>
              </ol>
            </nav>

            <h1 className="title-bold mt-3 text-[24px] lg:text-[28px]">{product.name}</h1>

            <div className="mt-2 flex items-baseline gap-3 text-[16px]">
              {price.onRequest ? (
                <span>{CENA_NA_UPIT}</span>
              ) : (
                <>
                  <span style={{ color: price.sale !== null ? 'var(--color-magenta)' : undefined }}>
                    {formatRsd(price.effective)}
                  </span>
                  {price.sale !== null && (
                    <span className="text-[14px] text-ink/40 line-through">{formatRsd(price.regular)}</span>
                  )}
                </>
              )}
            </div>

            {variants.length > 0 && (
              <div className="mt-7">
                <p className="text-[13px] text-ink/70">
                  Završna obrada: <span className="text-ink">{variant?.finish_name}</span>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2.5" role="group" aria-label="Izbor završne obrade">
                  {variants.map((v, i) => (
                    <button
                      key={v.id} type="button" title={v.finish_name}
                      aria-label={v.finish_name} aria-pressed={i === variantIdx}
                      onClick={() => setVariantIdx(i)}
                      className="h-9 w-9 rounded-full ring-1 ring-inset ring-ink/20"
                      style={{
                        background: v.finish_swatch ?? '#8C8477',
                        boxShadow: i === variantIdx ? '0 0 0 2px var(--color-ivory-2), 0 0 0 3.5px var(--color-ink)' : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 flex items-stretch gap-3">
              <div className="flex items-center border border-ink/20">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-[15px]" aria-label="Smanji količinu"
                >−</button>
                <span className="min-w-[30px] text-center text-[14px] tabular-nums" aria-live="polite">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="px-4 py-3 text-[15px]" aria-label="Povećaj količinu"
                >+</button>
              </div>
              <button
                onClick={addToCart}
                className="flex-1 bg-maroon-deep px-6 py-3.5 text-[15px] font-semibold text-ivory transition-opacity hover:opacity-90"
              >
                Dodaj u korpu
              </button>
            </div>
            <Link
              href={`/kontakt?proizvod=${encodeURIComponent(product.name)}`}
              className="mt-3 block border border-ink/25 px-6 py-3.5 text-center text-[15px] font-semibold transition-colors hover:border-ink"
            >
              Zatraži informacije
            </Link>

            {price.onRequest && (
              <p className="mt-4 text-[13px] leading-relaxed text-ink/60">
                Cena za ovaj model se formira prema količini i obradi. Dodajte proizvod u korpu i
                pošaljite porudžbinu — javljamo se sa ponudom pre isporuke.
              </p>
            )}

            <dl className="mt-9 space-y-5 text-[14px]">
              {[['Šifra', sku], ['Dimenzije', dimensions], ['Materijal', product.material]].map(([label, value]) => value && (
                <div key={label}>
                  <dt className="text-[12px] text-ink/55">{label}</dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
              {(product.description ?? product.short_description) && (
                <div>
                  <dt className="text-[12px] text-ink/55">Opis</dt>
                  <dd className="mt-1 whitespace-pre-line leading-[1.7] text-ink/80">
                    {product.description ?? product.short_description}
                  </dd>
                </div>
              )}
            </dl>

            {details.length > 0 && (
              <div className="mt-8">
                <Accordion items={details} defaultOpen={-1} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
