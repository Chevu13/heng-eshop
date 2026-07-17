import Link from 'next/link';

export function EmptyState({
  title, description, actionLabel, actionHref, tone = 'dark',
}: {
  title: string; description: string;
  actionLabel?: string; actionHref?: string; tone?: 'dark' | 'light';
}) {
  const light = tone === 'light';
  return (
    <div className="flex flex-col items-center px-6 py-24 text-center">
      <span
        aria-hidden="true"
        className="mb-8 block h-px w-16"
        style={{ background: 'var(--color-gold)' }}
      />
      <h3
        className="font-display text-[22px]"
        style={{ color: light ? 'var(--color-ivory)' : 'var(--color-ink)', fontWeight: 600 }}
      >
        {title}
      </h3>
      <p
        className="mt-3 max-w-md font-body text-[15px] leading-relaxed"
        style={{ color: light ? 'rgba(239,234,228,0.7)' : 'rgba(28,20,22,0.62)' }}
      >
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={`btn ${light ? 'btn-outline-light' : 'btn-outline'} mt-8`}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
