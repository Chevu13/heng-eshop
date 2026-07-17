import Image from 'next/image';
import { Reveal, ImageReveal } from '@/components/ui/Reveal';

export function Statement({ content }: {
  content: { heading?: string; body?: string; note?: string; mediaUrl?: string; mediaAlt?: string };
}) {
  return (
    <section className="bg-ivory-2 py-24 lg:py-32">
      <div className="heng-container">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 lg:pr-8">
            <Reveal>
              <h2
                className="font-display text-[clamp(1.9rem,4.4vw,2.6rem)] leading-[1.14]"
                style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                {content.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="heng-rule my-8 max-w-[220px]" />
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-[52ch] font-body text-[16px] leading-[1.7] text-ink/70 sm:text-[17px]">
                {content.body}
              </p>
            </Reveal>
            {content.note && (
              <Reveal delay={0.18}>
                <p
                  className="mt-8 font-display text-[19px] italic leading-snug"
                  style={{ color: 'var(--color-maroon)', fontWeight: 500 }}
                >
                  {content.note}
                </p>
              </Reveal>
            )}
          </div>

          {content.mediaUrl && (
            <div className="lg:col-span-5">
              <ImageReveal className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src={content.mediaUrl}
                  alt={content.mediaAlt ?? ''}
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </ImageReveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
