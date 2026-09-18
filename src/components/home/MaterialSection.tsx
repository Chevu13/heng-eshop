import Image from 'next/image';
import Link from 'next/link';
import { Reveal, ImageReveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface Point { title: string; text: string }

export interface MaterialContent {
  eyebrow?: string; heading?: string; body?: string;
  points?: Point[]; mediaUrl?: string; mediaAlt?: string;
  ctaLabel?: string; ctaHref?: string;
}

/**
 * Sekcija „velika fotografija / tekst”.
 *
 * `reverse` okreće raspored (tekst levo, fotografija desno) — tako dve
 * uzastopne sekcije prave dijagonalu umesto da se ponavljaju.
 * `fit` ostaje `contain` za fotografije proizvoda na beloj podlozi
 * (ceo profil mora da se vidi), a `cover` se koristi za ambijentalne
 * fotografije koje smeju da se kadriraju.
 */
export function MaterialSection({
  content, reverse = false, fit = 'contain', tone = 'light',
}: {
  content: MaterialContent;
  reverse?: boolean;
  fit?: 'contain' | 'cover';
  tone?: 'light' | 'shade';
}) {
  return (
    <section
      className={`${tone === 'shade' ? 'bg-ivory' : 'bg-ivory-2'} pb-14 pt-24 lg:pb-20 lg:pt-32`}
    >
      <div className="heng-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {content.mediaUrl && (
            <div className={`lg:col-span-5 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
              <ImageReveal
                className={`relative aspect-[3/4] overflow-hidden rounded-sm ${
                  tone === 'shade' ? 'bg-ivory' : 'bg-ivory-2'
                } lg:sticky lg:top-28`}
              >
                <Image
                  src={content.mediaUrl}
                  alt={content.mediaAlt ?? ''}
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className={fit === 'cover' ? 'object-cover' : 'object-contain'}
                />
              </ImageReveal>
            </div>
          )}

          <div
            className={`lg:col-span-7 ${reverse ? 'lg:order-1 lg:pr-6' : 'lg:order-2 lg:pl-6'}`}
          >
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
                          className="mt-[6px] font-body text-[11px] font-medium tabular-nums tracking-eyebrow"
                          style={{ color: 'var(--color-gold)' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-display text-[23px]" style={{ fontWeight: 500 }}>
                            {p.title}
                          </h3>
                          <p className="mt-2.5 max-w-[54ch] font-body text-[14px] font-light leading-[1.75] text-ink/60">
                            {p.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            )}

            {content.ctaLabel && content.ctaHref && (
              <Reveal delay={0.12}>
                <Link href={content.ctaHref} className="link-arrow mt-12 text-ink/75">
                  <span>{content.ctaLabel}</span>
                  <span className="link-arrow__line" aria-hidden="true" />
                </Link>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
