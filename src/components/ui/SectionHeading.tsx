import { Reveal } from './Reveal';

export function SectionHeading({
  eyebrow, heading, body, tone = 'dark', align = 'left', className = '',
}: {
  eyebrow?: string; heading: string; body?: string;
  tone?: 'dark' | 'light'; align?: 'left' | 'center'; className?: string;
}) {
  const light = tone === 'light';
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className="heng-eyebrow mb-4" style={{ color: 'var(--color-gold)' }}>
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className="font-display text-[30px] leading-[1.15] sm:text-[34px] lg:text-[36px]"
          style={{
            color: light ? 'var(--color-ivory)' : 'var(--color-ink)',
            fontWeight: 600,
          }}
        >
          {heading}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.1}>
          <p
            className="mt-5 font-body text-[16px] leading-[1.65]"
            style={{ color: light ? 'rgba(239,234,228,0.74)' : 'rgba(28,20,22,0.7)' }}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}
