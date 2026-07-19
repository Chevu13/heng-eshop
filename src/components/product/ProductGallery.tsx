'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ProductMedia } from '@/types';

/** Galerija: strelice i tastatura na desktopu, prevlačenje na mobilnom. */
export function ProductGallery({
  media, activeUrl, productName,
}: { media: ProductMedia[]; activeUrl: string | null; productName: string }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  // Promena obrade pomera galeriju na odgovarajuću fotografiju.
  useEffect(() => {
    if (!activeUrl) return;
    const i = media.findIndex((m) => m.url === activeUrl);
    if (i >= 0) setIndex(i);
  }, [activeUrl, media]);

  if (!media.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-ivory">
        <p className="font-body text-[13px] text-ink/40">Fotografija u pripremi</p>
      </div>
    );
  }

  const current = media[Math.min(index, media.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ivory">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {current.kind === 'video' ? (
              <video
                className="h-full w-full object-cover"
                src={current.url}
                poster={current.poster_url ?? undefined}
                autoPlay muted loop playsInline preload="metadata"
                aria-label={current.alt ?? productName}
              />
            ) : (
              <Image
                src={current.url}
                alt={current.alt ?? productName}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 94vw, 52vw"
                className="object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {media.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm border border-ink/12 bg-ivory-2/85 px-3 py-2 font-body text-[12px] transition-colors hover:border-gold"
              aria-label="Prethodna fotografija"
            >
              ←
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % media.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm border border-ink/12 bg-ivory-2/85 px-3 py-2 font-body text-[12px] transition-colors hover:border-gold"
              aria-label="Sledeća fotografija"
            >
              →
            </button>
            <p className="absolute bottom-3 right-3 rounded-sm bg-ivory-2/85 px-2.5 py-1 font-body text-[11px] tabular-nums text-ink/55">
              {index + 1} / {media.length}
            </p>
          </>
        )}
      </div>

      {media.length > 1 && (
        <ul className="mt-4 grid grid-cols-5 gap-3">
          {media.map((m, i) => (
            <li key={m.id}>
              <button
                onClick={() => setIndex(i)}
                aria-label={`Prikaži fotografiju ${i + 1}`}
                aria-current={i === index}
                className="relative block aspect-square w-full overflow-hidden rounded-sm bg-ivory transition-all duration-300"
                style={{
                  boxShadow: i === index
                    ? '0 0 0 1px var(--color-gold)'
                    : '0 0 0 1px rgba(28,20,22,0.1)',
                  opacity: i === index ? 1 : 0.62,
                }}
              >
                <Image
                  src={m.kind === 'video' ? (m.poster_url ?? m.url) : m.url}
                  alt=""
                  fill
                  sizes="90px"
                  className="object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
