import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

export function FinalCta({ content }: {
  content: {
    heading?: string; body?: string;
    primaryLabel?: string; primaryHref?: string;
    secondaryLabel?: string; secondaryHref?: string;
  };
}) {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36" style={{ background: 'var(--color-maroon)' }}>
      {/* Fine zlatne linije umesto punog gradijenta */}
      <span aria-hidden="true" className="heng-rule absolute inset-x-0 top-0" />
      <span aria-hidden="true" className="heng-rule absolute inset-x-0 bottom-0" />

      <div className="heng-container text-center">
        <Reveal>
          <h2
            className="mx-auto max-w-[18ch] font-display text-[clamp(2rem,5vw,3rem)] leading-[1.1] text-ivory"
            style={{ fontWeight: 700, letterSpacing: '-0.015em' }}
          >
            {content.heading}
          </h2>
        </Reveal>
        {content.body && (
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-[52ch] font-body text-[16px] leading-[1.7] text-ivory/70">
              {content.body}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {content.primaryLabel && content.primaryHref && (
              <Link
                href={content.primaryHref}
                className="btn w-full rounded-sm border sm:w-auto"
                style={{
                  background: 'var(--color-ivory)',
                  color: 'var(--color-maroon-deep)',
                  borderColor: 'var(--color-ivory)',
                }}
              >
                {content.primaryLabel}
              </Link>
            )}
            {content.secondaryLabel && content.secondaryHref && (
              <Link href={content.secondaryHref} className="btn btn-outline-light w-full sm:w-auto">
                {content.secondaryLabel}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
