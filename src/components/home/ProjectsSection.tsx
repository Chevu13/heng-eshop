import Image from 'next/image';
import Link from 'next/link';
import { Reveal, ImageReveal } from '@/components/ui/Reveal';

export function ProjectsSection({ content }: {
  content: {
    eyebrow?: string; heading?: string; body?: string; audience?: string[];
    ctaLabel?: string; ctaHref?: string; mediaUrl?: string; mediaAlt?: string;
  };
}) {
  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--color-maroon-deep)' }}>
      <div className="grid lg:grid-cols-2">
        {content.mediaUrl && (
          <ImageReveal className="relative min-h-[52vh] lg:min-h-[86vh]">
            <Image
              src={content.mediaUrl}
              alt={content.mediaAlt ?? ''}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </ImageReveal>
        )}

        <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 lg:py-24 xl:px-20">
          <div className="max-w-[46ch]">
            <Reveal>
              <p className="heng-eyebrow mb-5" style={{ color: 'var(--color-gold)' }}>
                {content.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="font-display text-[clamp(1.9rem,4vw,2.5rem)] leading-[1.14] text-ivory"
                style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                {content.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 font-body text-[16px] leading-[1.7] text-ivory/72">
                {content.body}
              </p>
            </Reveal>

            {content.audience && content.audience.length > 0 && (
              <Reveal delay={0.18}>
                <>
                  <div className="heng-rule my-9" />
                  <ul className="flex flex-wrap gap-x-3 gap-y-2.5">
                    {content.audience.map((a) => (
                      <li
                        key={a}
                        className="rounded-sm border border-ivory/18 px-3 py-1.5 font-body text-[12px] text-ivory/68"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </>
              </Reveal>
            )}

            {content.ctaLabel && content.ctaHref && (
              <Reveal delay={0.24}>
                <Link href={content.ctaHref} className="btn btn-outline-light mt-10">
                  {content.ctaLabel}
                </Link>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
