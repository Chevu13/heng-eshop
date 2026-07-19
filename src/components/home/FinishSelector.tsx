'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type { ProductFull } from '@/types';
import { FinishSwatch } from '@/components/product/FinishSwatch';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Interaktivni izbor završne obrade — menja fotografiju gde postoji medij. */
export function FinishSelector({
  content, product,
}: {
  content: { eyebrow?: string; heading?: string; body?: string };
  product: ProductFull | null;
}) {
  const variants = (product?.variants ?? []).filter((v) => v.is_active && v.main_image);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  if (!product || variants.length === 0) return null;
  const current = variants[Math.min(active, variants.length - 1)];

  return (
    <section className="py-24 lg:py-32" style={{ background: 'var(--color-maroon)' }}>
      <div className="heng-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow={content.eyebrow}
              heading={content.heading ?? ''}
              body={content.body}
              tone="light"
            />

            <div className="heng-rule my-10 max-w-[260px]" />

            <div
              className="grid grid-cols-4 gap-2 sm:gap-6"
              role="group"
              aria-label="Izbor završne obrade"
            >
              {variants.map((v, i) => (
                <FinishSwatch
                  key={v.id}
                  name={v.finish_name}
                  color={v.finish_swatch ?? '#8C8477'}
                  selected={i === active}
                  onSelect={() => setActive(i)}
                  size="lg"
                  tone="light"
                />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <p className="font-body text-[14px] text-ivory/62">
                Prikazano na modelu{' '}
                <Link href={`/proizvod/${product.slug}`} className="link-gold text-ivory">
                  {product.name}
                </Link>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-maroon-deep sm:aspect-[16/11]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={current.main_image as string}
                    alt={`${product.name} u obradi ${current.finish_name.toLowerCase()}`}
                    fill
                    sizes="(max-width: 1024px) 92vw, 55vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
              <p
                className="absolute bottom-4 left-4 rounded-sm px-3 py-1.5 font-body text-[11px] uppercase tracking-eyebrow"
                style={{ background: 'rgba(51,25,30,0.72)', color: 'var(--color-ivory)' }}
                aria-live="polite"
              >
                {current.finish_name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
