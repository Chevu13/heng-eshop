import Link from 'next/link';

/**
 * Tekstualni wordmark u Fraunces-u — privremeno rešenje do isporuke
 * finalne vektorske (SVG) verzije logotipa, prema napomeni u brand
 * guidelines dokumentu (str. 02).
 */
export function Wordmark({
  className = '', tone = 'ivory', href = '/',
}: { className?: string; tone?: 'ivory' | 'maroon'; href?: string | null }) {
  const inner = (
    <span
      className={`font-display leading-none ${className}`}
      style={{
        color: tone === 'ivory' ? 'var(--color-ivory)' : 'var(--color-maroon)',
        fontWeight: 700,
        fontVariationSettings: "'opsz' 144, 'SOFT' 60",
        letterSpacing: '-0.02em',
      }}
    >
      Heng
    </span>
  );
  if (!href) return inner;
  return (
    <Link href={href} aria-label="HENG — početna strana" className="inline-block">
      {inner}
    </Link>
  );
}
