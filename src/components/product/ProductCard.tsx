'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ProductFull } from '@/types';
import { startingPrice } from '@/lib/pricing';
import { formatRsd, CENA_NA_UPIT } from '@/lib/format';

export function ProductCard({ product, priority = false }: { product: ProductFull; priority?: boolean }) {
  const [hover, setHover] = useState(false);

  const cover = product.media.find((m) => m.is_cover) ?? product.media[0];
  const secondary = product.media.find((m) => m.id !== cover?.id && m.kind === 'image');
  const price = startingPrice(product);
  const finishes = product.variants.filter((v) => v.is_active);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group"
    >
      <Link href={`/proizvod/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-ivory">
          {cover ? (
            <>
              <Image
                src={cover.url}
                alt={cover.alt ?? product.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover transition-[opacity,transform] duration-[900ms] ease-heng"
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
                  sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover transition-[opacity,transform] duration-[900ms] ease-heng"
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

      <div className="pt-4">
        {product.category && (
          <p className="heng-eyebrow text-ink/45">{product.category.title}</p>
        )}
        <h3 className="mt-2 font-display text-[19px] leading-tight" style={{ fontWeight: 600 }}>
          <Link href={`/proizvod/${product.slug}`} className="link-gold">{product.name}</Link>
        </h3>

        <div className="mt-2 flex items-baseline gap-3">
          {price.onRequest ? (
            <span className="font-body text-[14px] text-ink/65">{CENA_NA_UPIT}</span>
          ) : (
            <>
              <span className="font-body text-[14px]">
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

        {finishes.length > 0 && (
          <ul className="mt-3 flex items-center gap-2" aria-label="Dostupne završne obrade">
            {finishes.map((v) => (
              <li key={v.id} title={v.finish_name}>
                <span
                  className="block h-[11px] w-[11px] rounded-sm ring-1 ring-inset ring-ink/15"
                  style={{ background: v.finish_swatch ?? '#8C8477' }}
                />
                <span className="sr-only">{v.finish_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
