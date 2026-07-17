import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Instagram sekcija koristi lokalne fotografije — bez zavisnosti od
 * Instagram API-ja i bez hotlinkovanja tuđeg CDN-a.
 */
export function InstagramSection({ content }: {
  content: { eyebrow?: string; heading?: string; ctaLabel?: string; href?: string; items?: string[] };
}) {
  const items = content.items ?? [];
  if (!items.length) return null;

  return (
    <section className="bg-ivory-2 py-20 lg:py-24">
      <div className="heng-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="heng-eyebrow mb-3" style={{ color: 'var(--color-gold)' }}>
                {content.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[26px]" style={{ fontWeight: 600 }}>
                {content.heading}
              </h2>
            </Reveal>
          </div>
          {content.href && content.ctaLabel && (
            <Reveal delay={0.1}>
              <a
                href={content.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-gold font-body text-[13px] uppercase tracking-eyebrow"
              >
                {content.ctaLabel}
              </a>
            </Reveal>
          )}
        </div>

        <div className="heng-rule my-10" />

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((url, i) => (
            <Reveal as="li" key={url} delay={i * 0.06}>
              <a
                href={content.href ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-sm bg-ivory"
                aria-label="Otvori Instagram profil @heng.srb"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 46vw, 23vw"
                  className="object-cover transition-transform duration-[900ms] ease-heng group-hover:scale-[1.05]"
                />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
