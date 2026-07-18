'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Hero medij. Video se koristi samo kada je zaista isporučen i kada
 * korisnik nije zatražio smanjeno kretanje. Na uskim ekranima i sporim
 * vezama prikazuje se poster/fotografija — bez skidanja video fajla.
 */
export function HeroMedia({
  imageUrl, imageAlt, videoUrl, videoPoster,
}: {
  imageUrl?: string; imageAlt: string;
  videoUrl: string | null; videoPoster: string | null;
}) {
  const reduce = useReducedMotion();
  const [useVideo, setUseVideo] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoUrl || reduce) return;
    const wideEnough = window.matchMedia('(min-width: 768px)').matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = conn?.saveData || ['slow-2g', '2g'].includes(conn?.effectiveType ?? '');
    setUseVideo(wideEnough && !slow);
  }, [videoUrl, reduce]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { void v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  }

  const poster = videoPoster ?? imageUrl;

  if (useVideo && videoUrl) {
    return (
      <>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
          poster={poster}
          autoPlay muted loop playsInline preload="metadata"
          aria-label={imageAlt}
        />
        <button
          onClick={togglePlay}
          className="absolute bottom-6 right-6 z-20 rounded-sm border border-ivory/35 px-3 py-1.5 font-body text-[11px] uppercase tracking-eyebrow text-ivory/80 transition-colors hover:border-amber hover:text-amber"
        >
          {paused ? 'Pusti' : 'Pauziraj'}
        </button>
      </>
    );
  }

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={imageAlt}
      fill
      priority
      quality={82}
      sizes="100vw"
      className="object-cover"
      style={{ objectPosition: 'center 30%' }}
    />
  );
}
