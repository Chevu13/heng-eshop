'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';

export interface CategoryTile {
  title: string;
  body?: string;
  href: string;
  ctaLabel?: string;
  mediaUrl: string;
  mediaAlt?: string;
  /** Fokus fotografije, npr. „center 35%”. Podrazumevano je centar. */
  mediaPosition?: string;
}

export interface CategorySplitContent {
  items?: CategoryTile[];
}

/**
 * 01 — KATEGORIJE.
 * Dva vizuala jedan pored drugog (od 640px naviše), bez razmaka: podeljen ekran sa tankom
 * zlatnom linijom na spoju. Ceo panel je klikabilan; tekst stoji u donjem
 * levom uglu, iznad kontrolisanog gradijenta koji čuva čitljivost.
 */
export function CategorySplit({ content }: { content: CategorySplitContent }) {
  const items = content.items ?? [];
  const reduce = useReducedMotion();
  if (items.length === 0) return null;

  return (
    <section aria-label="Kategorije" className="bg-maroon-deep">
      <div className="grid sm:grid-cols-2">
        {items.map((item, i) => (
          <motion.article
            key={item.href + item.title}
            className="group relative isolate min-h-[560px] overflow-hidden sm:min-h-[620px] lg:min-h-[88vh]"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={
              i > 0
                ? { boxShadow: 'inset 1px 0 0 rgba(239,234,228,0.16)' }
                : undefined
            }
          >
            <Image
              src={item.mediaUrl}
              alt={item.mediaAlt ?? ''}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              quality={82}
              className="object-cover transition-transform duration-[1.4s] ease-heng group-hover:scale-[1.04]"
              style={{ objectPosition: item.mediaPosition ?? 'center' }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(28,20,22,0.92) 0%, rgba(28,20,22,0.74) 30%, rgba(28,20,22,0.28) 58%, rgba(28,20,22,0.08) 100%)',
              }}
            />

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 lg:p-14 xl:p-16">
              <span
                aria-hidden="true"
                className="font-body text-[11px] font-medium tabular-nums tracking-eyebrow text-ivory/85"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden="true"
                className="mt-4 block h-px w-14 bg-ivory/55"
              />

              <h2 className="display-caps mt-7 max-w-[15ch] text-[1.9rem] text-ivory sm:text-[clamp(1.5rem,3.4vw,2.9rem)]">
                {item.title}
              </h2>

              {item.body && (
                <p className="mt-6 max-w-[38ch] font-body text-[14px] font-light leading-[1.7] text-ivory/72 sm:text-[15px]">
                  {item.body}
                </p>
              )}

              <Link href={item.href} className="link-arrow mt-10 text-ivory/85">
                {/* Link pokriva ceo panel — cela pločica je klikabilna. */}
                <span className="absolute inset-0 z-10" aria-hidden="true" />
                <span>{item.ctaLabel ?? 'Istraži proizvode'}</span>
                <span className="link-arrow__line" aria-hidden="true" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
