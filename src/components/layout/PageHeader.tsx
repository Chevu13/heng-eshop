import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

export interface Crumb { label: string; href?: string }

export function PageHeader({
  eyebrow, title, description, crumbs = [],
}: { eyebrow?: string; title: string; description?: string; crumbs?: Crumb[] }) {
  return (
    <header className="bg-ivory-2 pb-12 pt-14 lg:pb-16 lg:pt-20">
      <div className="heng-container">
        {crumbs.length > 0 && (
          <nav aria-label="Putanja" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-body text-[12px] text-ink/45">
              <li>
                <Link href="/" className="link-gold">Početna</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-ink/25">/</span>
                  {c.href ? (
                    <Link href={c.href} className="link-gold">{c.label}</Link>
                  ) : (
                    <span aria-current="page" className="text-ink/70">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <Reveal>
            <p className="heng-eyebrow mb-4" style={{ color: 'var(--color-gold)' }}>{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1
            className="max-w-[20ch] font-display text-[clamp(2rem,5vw,3rem)] leading-[1.08]"
            style={{ fontWeight: 700, letterSpacing: '-0.015em' }}
          >
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[58ch] font-body text-[16px] leading-[1.7] text-ink/65">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
