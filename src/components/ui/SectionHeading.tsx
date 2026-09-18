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
          className="display-caps text-[30px] sm:text-[34px] lg:text-[42px]"
          style={{ color: light ? 'var(--color-ivory)' : 'var(--color-ink)', fontWeight: 400 }}
        >
          {heading}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.1}>
          <p
            className="mt-6 max-w-[46ch] font-body text-[15px] font-light leading-[1.75] sm:text-[16px]"
            style={{ color: light ? 'rgba(239,234,228,0.74)' : 'rgba(28,20,22,0.7)' }}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}
