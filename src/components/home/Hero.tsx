'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { HeroMedia } from './HeroMedia';

export interface HeroContent {
  eyebrow?: string; heading?: string; body?: string;
  primaryLabel?: string; primaryHref?: string;
  secondaryLabel?: string; secondaryHref?: string;
  mediaUrl?: string; mediaAlt?: string;
  videoUrl?: string | null; videoPoster?: string | null;
}

export function Hero({ content }: { content: HeroContent }) {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  const words = (content.heading ?? '').split(' ');

  return (
    <section
      className="relative flex min-h-[86svh] items-end overflow-hidden lg:min-h-[100svh]"
      style={{ background: 'var(--color-maroon-deep)' }}
    >
      <HeroMedia
        imageUrl={content.mediaUrl}
        imageAlt={content.mediaAlt ?? ''}
        videoUrl={content.videoUrl ?? null}
        videoPoster={content.videoPoster ?? null}
      />

      {/* Kontrolisan kontrast — bez pokrivanja cele fotografije gradijentom */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(51,25,30,0.92) 0%, rgba(51,25,30,0.55) 34%, rgba(51,25,30,0.12) 62%, rgba(51,25,30,0.42) 100%)',
        }}
      />

      <div className="heng-container relative z-10 pb-16 pt-40 lg:pb-24">
        <div className="max-w-[760px]">
          {content.eyebrow && (
            <motion.p
              className="heng-eyebrow mb-6"
              style={{ color: 'var(--color-gold)' }}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              {content.eyebrow}
            </motion.p>
          )}

          <h1
            className="font-display text-[clamp(2.25rem,7vw,3.5rem)] leading-[1.08] text-ivory"
            style={{ fontWeight: 700, letterSpacing: '-0.015em' }}
          >
            {words.map((w, i) => (
              <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.16 + i * 0.06, ease }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>

          {content.body && (
            <motion.p
              className="mt-6 max-w-[46ch] font-body text-[16px] leading-[1.65] text-ivory/76 sm:text-[18px]"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
            >
              {content.body}
            </motion.p>
          )}

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease }}
          >
            {content.primaryLabel && content.primaryHref && (
              <Link href={content.primaryHref} className="btn btn-primary">
                {content.primaryLabel}
              </Link>
            )}
            {content.secondaryLabel && content.secondaryHref && (
              <Link href={content.secondaryHref} className="btn btn-outline-light">
                {content.secondaryLabel}
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
