import Image from 'next/image';
import { Reveal, ImageReveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface Point { title: string; text: string }

export function MaterialSection({ content }: {
  content: {
    eyebrow?: string; heading?: string; body?: string;
    points?: Point[]; mediaUrl?: string; mediaAlt?: string;
  };
}) {
  return (
    <section className="bg-ivory-2 pb-14 pt-24 lg:pb-20 lg:pt-32">
      <div className="heng-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {content.mediaUrl && (
            <div className="lg:col-span-5">
              <ImageReveal className="relative aspect-[3/4] overflow-hidden rounded-sm bg-ivory-2 lg:sticky lg:top-28">
                <Image
                  src={content.mediaUrl}
                  alt={content.mediaAlt ?? ''}
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-contain"
                />
              </ImageReveal>
            </div>
          )}

          <div className="lg:col-span-7 lg:pl-6">
            <SectionHeading
              eyebrow={content.eyebrow}
              heading={content.heading ?? ''}
              body={content.body}
            />

            {content.points && content.points.length > 0 && (
              <ul className="mt-12">
                {content.points.map((p, i) => (
                  <Reveal as="li" key={p.title} delay={i * 0.08}>
                    <div className="border-t border-ink/12 py-7">
                      <div className="flex gap-6">
                        <span
                          className="mt-1 font-display text-[13px] tabular-nums"
                          style={{ color: 'var(--color-gold)', fontWeight: 600 }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-display text-[19px]" style={{ fontWeight: 600 }}>
                            {p.title}
                          </h3>
                          <p className="mt-2 max-w-[54ch] font-body text-[15px] leading-relaxed text-ink/65">
                            {p.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
