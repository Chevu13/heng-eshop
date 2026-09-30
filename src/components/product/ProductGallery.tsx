'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { ProductMedia } from '@/types';

/** Galerija: prevlačenje prstom (scroll-snap), strelice samo na računaru. */
export function ProductGallery({
  media, productName,
}: { media: ProductMedia[]; productName: string }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  if (!media.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-ivory">
        <p className="font-body text-[13px] text-ink/40">Fotografija u pripremi</p>
      </div>
    );
  }

  const go = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: ((i + media.length) % media.length) * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ivory">
        <div
          ref={track}
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {media.map((m, i) => (
            <div key={m.id} className="relative h-full w-full shrink-0 snap-center">
              {m.kind === 'video' ? (
                <video
                  className="h-full w-full object-cover"
                  src={m.url}
                  poster={m.poster_url ?? undefined}
                  autoPlay muted loop playsInline preload="metadata"
                  aria-label={m.alt ?? productName}
                />
              ) : (
                <Image
                  src={m.url}
                  alt={m.alt ?? productName}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 94vw, 52vw"
                  className="object-contain"
                />
              )}
            </div>
          ))}
        </div>

        {media.length > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-sm border border-ink/12 bg-ivory-2/85 px-3 py-2 font-body text-[12px] transition-colors hover:border-gold md:block"
              aria-label="Prethodna fotografija"
            >
              ←
            </button>
            <button
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-sm border border-ink/12 bg-ivory-2/85 px-3 py-2 font-body text-[12px] transition-colors hover:border-gold md:block"
              aria-label="Sledeća fotografija"
            >
              →
            </button>
            {/* Tačkice na telefonu, brojač na računaru. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
              {media.map((m, i) => (
                <span key={m.id} className="h-1.5 w-1.5 rounded-full transition-colors" style={{ background: i === index ? 'var(--color-ink)' : 'rgba(28,20,22,0.25)' }} />
              ))}
            </div>
            <p className="absolute bottom-3 right-3 hidden rounded-sm bg-ivory-2/85 px-2.5 py-1 font-body text-[11px] tabular-nums text-ink/55 md:block">
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
                onClick={() => go(i)}
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
