'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ProductFull } from '@/types';
import { startingPrice } from '@/lib/pricing';
import { formatRsd, CENA_NA_UPIT } from '@/lib/format';

export function ProductCard({ product, priority = false }: { product: ProductFull; priority?: boolean }) {
  const [hover, setHover] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const price = startingPrice(product);
  const finishes = product.variants.filter((v) => v.is_active);
  const chosen = finishes.find((v) => v.id === picked);
  const baseCover = product.media.find((m) => m.is_cover) ?? product.media[0];
  // Izabrana obrada menja fotografiju; bez izbora važi naslovna.
  const cover = chosen?.main_image
    ? { ...baseCover, id: chosen.id, url: chosen.main_image, alt: `${product.name} — ${chosen.finish_name}` }
    : baseCover;
  const secondary = chosen ? undefined : product.media.find((m) => m.id !== cover?.id && m.kind === 'image');
  const href = chosen ? `/proizvod/${product.slug}?obrada=${chosen.finish_code}` : `/proizvod/${product.slug}`;

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group"
    >
      <Link href={href} className="block">
        {/* 4:5 i object-contain: naslovna fotografija se vidi cela. */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ivory">
          {cover ? (
            <>
              <Image
                src={cover.url}
                alt={cover.alt ?? product.name}
                fill
                priority={priority}
                sizes="(max-width: 768px) 48vw, (max-width: 1024px) 32vw, 24vw"
                className="object-contain transition-[opacity,transform] duration-[900ms] ease-heng"
                style={{
                  opacity: hover && secondary ? 0 : 1,
                  transform: hover ? 'scale(1.035)' : 'scale(1)',
                }}
              />
              {secondary && (
                <Image
                  src={secondary.url}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(max-width: 768px) 48vw, (max-width: 1024px) 32vw, 24vw"
                  className="object-contain transition-[opacity,transform] duration-[900ms] ease-heng"
                  style={{ opacity: hover ? 1 : 0, transform: hover ? 'scale(1.035)' : 'scale(1)' }}
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-body text-[13px] text-ink/35">Fotografija u pripremi</span>
            </div>
          )}

          {price.sale !== null && (
            <span
              className="absolute left-3 top-3 rounded-sm px-2.5 py-1 font-body text-[10px] uppercase tracking-eyebrow"
              style={{ background: 'var(--color-magenta)', color: 'var(--color-ivory)' }}
            >
              Akcija
            </span>
          )}
        </div>
      </Link>

      {/* Naziv levo, cena desno — kao u katalozima okova. */}
      <div className="flex flex-col gap-1 px-1 pt-3 font-body md:flex-row md:items-baseline md:justify-between md:gap-3 md:px-0">
        <h3 className="font-body text-[14px] font-normal leading-snug md:text-[15px]" style={{ letterSpacing: 0 }}>
          <Link href={href} className="hover:underline hover:underline-offset-4">{product.name}</Link>
        </h3>

        <div className="flex items-baseline gap-2">
          {price.onRequest ? (
            <span className="font-body text-[14px] text-ink/65">{CENA_NA_UPIT}</span>
          ) : (
            <>
              <span className="font-body text-[14px] text-ink/80 md:text-[15px]">
                {product.variants.length > 1 && 'od '}{formatRsd(price.effective)}
              </span>
              {price.sale !== null && price.regular !== null && (
                <span className="font-body text-[13px] text-ink/40 line-through">
                  {formatRsd(price.regular)}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {finishes.length > 0 && (
          <ul className="mt-2 flex flex-wrap items-center gap-0.5 px-0.5 md:px-0" aria-label="Završne obrade">
            {finishes.map((v) => {
              const on = v.id === picked;
              return (
                <li key={v.id}>
                  {/* 28 px polje za prst, kružić 16 px; izabran = tamni prsten. */}
                  <button
                    type="button" title={v.finish_name} aria-pressed={on}
                    onClick={() => setPicked(on ? null : v.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                  >
                    <span
                      className="block h-[16px] w-[16px] rounded-full ring-1 ring-inset ring-ink/20"
                      style={{
                        background: v.finish_swatch ?? '#8C8477',
                        boxShadow: on ? '0 0 0 2px var(--color-ivory-2), 0 0 0 3px var(--color-ink)' : undefined,
                      }}
                    />
                    <span className="sr-only">{v.finish_name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
    </article>
  );
}
