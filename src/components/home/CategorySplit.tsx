'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';

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
 * Na telefonu slajder (scroll-snap): kartica zauzima ~86% širine, pa se
 * sledeća nazire i poziva na prevlačenje. Od 640px dva vizuala jedan pored
 * drugog, bez razmaka: podeljen ekran sa tankom zlatnom linijom na spoju.
 * Svetla traka sa naslovom odvaja sekciju od tamnog hero-a — bez nje se
 * dve tamne površine stapaju u jednu, naročito na telefonu. Ceo panel je klikabilan; tekst stoji u donjem
 * levom uglu, iznad kontrolisanog gradijenta koji čuva čitljivost.
 */
export function CategorySplit({ content }: { content: CategorySplitContent }) {
  const items = content.items ?? [];
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;

  return (
    <section aria-label="Kategorije" className="bg-ivory-2 pb-10 sm:pb-0">
      <div className="heng-container pb-10 pt-16 lg:pb-14 lg:pt-24">
        <SectionHeading eyebrow="KOLEKCIJA" heading="Izaberite svoj detalj." />
      </div>
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-0 sm:overflow-visible sm:px-0"
        onScroll={(e) => {
          const el = e.currentTarget;
          const max = el.scrollWidth - el.clientWidth;
          if (max > 0) setActive(Math.round((el.scrollLeft / max) * (items.length - 1)));
        }}
      >
        {items.map((item, i) => (
          <motion.article
            key={item.href + item.title}
            className="group relative isolate min-h-[520px] w-[86%] shrink-0 snap-center overflow-hidden rounded-sm sm:min-h-[620px] sm:w-auto sm:rounded-none lg:min-h-[88vh]"
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

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-7 md:p-12 lg:p-14 xl:p-16">
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

              <h2
                className="display-caps mt-7 max-w-[15ch] text-[2.1rem] text-ivory sm:text-[clamp(1.6rem,3.6vw,3.1rem)]"
                style={{ fontWeight: 500 }}
              >
                {item.title}
              </h2>

              {item.body && (
                <p className="mt-6 max-w-[38ch] font-body text-[14px] font-light leading-[1.7] text-ivory/72 sm:text-[15px]">
                  {item.body}
                </p>
              )}

              <Link href={item.href} className="link-arrow mt-10">
                {/* Link pokriva ceo panel — cela pločica je klikabilna. */}
                <span className="absolute inset-0 z-10" aria-hidden="true" />
                <span>{item.ctaLabel ?? 'Istraži proizvode'}</span>
                <span className="link-arrow__line" aria-hidden="true" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Indikator slajda — samo na telefonu. */}
      <div aria-hidden="true" className="mt-6 flex justify-center gap-2 sm:hidden">
        {items.map((item, i) => (
          <span
            key={item.title}
            className="h-px w-8 transition-colors duration-300"
            style={{ background: i === active ? 'var(--color-gold)' : 'rgba(28,20,22,0.2)' }}
          />
        ))}
      </div>
    </section>
  );
}
