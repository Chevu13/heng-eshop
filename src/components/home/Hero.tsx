'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { HeroMedia } from './HeroMedia';

export interface HeroContent {
  eyebrow?: string; heading?: string; body?: string;
  primaryLabel?: string; primaryHref?: string;
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
            'linear-gradient(to top, rgba(51,25,30,0.94) 0%, rgba(51,25,30,0.78) 26%, rgba(51,25,30,0.34) 58%, rgba(51,25,30,0.10) 78%, rgba(51,25,30,0.45) 100%)',
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

          <h1 className="display-caps text-[clamp(2.4rem,6.4vw,4.4rem)] text-ivory">
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
              className="mt-7 max-w-[52ch] font-body text-[15px] font-light leading-[1.75] text-ivory/78 sm:text-[17px]"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
            >
              {content.body}
            </motion.p>
          )}

          {/* Jedan jedini poziv na akciju — hero ostaje čist. */}
          {content.primaryLabel && content.primaryHref && (
            <motion.div
              className="mt-10"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.58, ease }}
            >
              <Link href={content.primaryHref} className="btn btn-primary">
                {content.primaryLabel}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
