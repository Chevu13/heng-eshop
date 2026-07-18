'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';

export interface GalleryItem { url: string; caption?: string; alt: string }

/**
 * Asimetrična editorijalna galerija. Kadriranje se bira po sadržaju
 * fotografije — nijedan format ne odseca nosač, etiketu ili kontekst.
 */
const SPANS = [
  'lg:col-span-7 aspect-[4/3]',
  'lg:col-span-5 aspect-[3/4]',
  'lg:col-span-5 aspect-[3/4]',
  'lg:col-span-7 aspect-[4/3]',
  'lg:col-span-6 aspect-[4/5]',
  'lg:col-span-6 aspect-[4/5]',
];

export function InspirationGallery({ items, columns = SPANS }: {
  items: GalleryItem[]; columns?: string[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close, step]);

  if (!items.length) return null;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {items.map((item, i) => (
          <Reveal
            as="li"
            key={item.url}
            delay={(i % 3) * 0.08}
            className={columns[i % columns.length]}
          >
            <button
              onClick={() => setOpen(i)}
              className="group relative block h-full w-full overflow-hidden rounded-sm bg-ivory text-left"
              aria-label={`Uvećaj: ${item.caption ?? item.alt}`}
            >
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 45vw"
                className="object-cover transition-transform duration-[1100ms] ease-heng group-hover:scale-[1.04]"
              />
              {item.caption && (
                <span
                  className="absolute inset-x-0 bottom-0 translate-y-1 p-4 font-body text-[12px] text-ivory opacity-0 transition-all duration-500 ease-heng group-hover:translate-y-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(to top, rgba(51,25,30,0.82), transparent)' }}
                >
                  {item.caption}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Uvećan prikaz fotografije"
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-4 sm:p-10"
            style={{ background: 'rgba(28,20,22,0.94)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
          >
            <div className="relative h-[74vh] w-full max-w-5xl">
              <Image
                src={items[open].url}
                alt={items[open].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            {items[open].caption && (
              <p className="mt-5 max-w-xl text-center font-body text-[14px] text-ivory/70">
                {items[open].caption}
              </p>
            )}
            <div className="mt-6 flex items-center gap-8">
              <button onClick={() => step(-1)} className="link-gold font-body text-[12px] uppercase tracking-eyebrow text-ivory/70">
                Prethodna
              </button>
              <span className="font-body text-[12px] text-ivory/60 tabular-nums">
                {open + 1} / {items.length}
              </span>
              <button onClick={() => step(1)} className="link-gold font-body text-[12px] uppercase tracking-eyebrow text-ivory/70">
                Sledeća
              </button>
            </div>
            <button
              onClick={close}
              className="absolute right-5 top-5 font-body text-[12px] uppercase tracking-eyebrow text-ivory/70 hover:text-amber"
            >
              Zatvori
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
