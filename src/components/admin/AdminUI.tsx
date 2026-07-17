import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminHeading({
  title, description, action,
}: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[28px] leading-tight" style={{ fontWeight: 600 }}>{title}</h1>
        {description && (
          <p className="mt-2 max-w-[62ch] font-body text-[14px] text-ink/58">{description}</p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-sm border border-ink/12 bg-white/60 p-6 ${className}`}>{children}</div>
  );
}

export function Stat({ label, value, href, tone = 'default' }: {
  label: string; value: string | number; href?: string; tone?: 'default' | 'alert';
}) {
  const inner = (
    <div
      className="rounded-sm border p-5 transition-colors duration-200"
      style={{
        borderColor: tone === 'alert' ? 'rgba(198,23,143,0.35)' : 'rgba(28,20,22,0.12)',
        background: 'rgba(255,255,255,0.6)',
      }}
    >
      <p className="heng-eyebrow text-ink/45">{label}</p>
      <p
        className="mt-3 font-display text-[30px] tabular-nums leading-none"
        style={{ fontWeight: 600, color: tone === 'alert' ? 'var(--color-magenta)' : 'var(--color-ink)' }}
      >
        {value}
      </p>
    </div>
  );
  return href ? <Link href={href} className="block hover:opacity-90">{inner}</Link> : inner;
}

export function Badge({ children, tone = 'neutral' }: {
  children: ReactNode; tone?: 'neutral' | 'gold' | 'magenta' | 'muted';
}) {
  const map = {
    neutral: { bg: 'rgba(75,38,45,0.09)', fg: 'var(--color-maroon)' },
    gold: { bg: 'rgba(184,147,79,0.16)', fg: '#8A6C34' },
    magenta: { bg: 'rgba(198,23,143,0.1)', fg: 'var(--color-magenta)' },
    muted: { bg: 'rgba(28,20,22,0.06)', fg: 'rgba(28,20,22,0.55)' },
  }[tone];
  return (
    <span
      className="inline-block whitespace-nowrap rounded-sm px-2 py-1 font-body text-[11px] uppercase tracking-eyebrow"
      style={{ background: map.bg, color: map.fg }}
    >
      {children}
    </span>
  );
}

export function TableEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-sm border border-dashed border-ink/18 px-6 py-16 text-center">
      <p className="font-display text-[18px]" style={{ fontWeight: 600 }}>{title}</p>
      <p className="mx-auto mt-2 max-w-md font-body text-[14px] text-ink/55">{description}</p>
    </div>
  );
}
