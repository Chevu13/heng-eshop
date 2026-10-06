'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { ProductMedia } from '@/types';

/**
 * Galerija po uzoru na Shopify „Dawn”: na računaru sve fotografije u mreži
 * od dve kolone, na telefonu slajder na prevlačenje sa brojačem ispod.
 */
export function ProductGallery({
  media, productName,
}: { media: ProductMedia[]; productName: string }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLUListElement>(null);

  if (!media.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-ivory">
        <p className="font-body text-[13px] text-ink/40">Fotografija u pripremi</p>
      </div>
    );
  }

  // Korak slajda = širina prve fotografije + razmak.
  const step = () => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first && el ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : 1;
  };
  const go = (i: number) =>
    track.current?.scrollTo({ left: Math.max(0, Math.min(media.length - 1, i)) * step(), behavior: 'smooth' });

  return (
    <div>
      <ul
        ref={track}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / step()))}
        className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {media.map((m, i) => (
          <li
            key={m.id}
            className={`relative aspect-[4/5] shrink-0 snap-start overflow-hidden rounded-sm bg-ivory lg:w-auto ${media.length > 1 ? 'w-[88%]' : 'w-full'}`}
          >
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
                sizes="(max-width: 1024px) 88vw, 28vw"
                className="object-contain"
              />
            )}
          </li>
        ))}
      </ul>

      {media.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-5 font-body text-[12px] tabular-nums text-ink/60 lg:hidden">
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Prethodna fotografija" className="p-2 disabled:opacity-30">‹</button>
          <span>{index + 1} / {media.length}</span>
          <button onClick={() => go(index + 1)} disabled={index === media.length - 1} aria-label="Sledeća fotografija" className="p-2 disabled:opacity-30">›</button>
        </div>
      )}
    </div>
  );
}
