'use client';

import Link from 'next/link';

export function AnnouncementBar({
  text, href, linkLabel, collapsed,
}: { text: string; href?: string; linkLabel?: string; collapsed: boolean }) {
  return (
    <div
      className="w-full overflow-hidden transition-[height,opacity] duration-500 ease-heng"
      style={{
        background: 'var(--color-maroon-deep)',
        height: collapsed ? 0 : 36,
        opacity: collapsed ? 0 : 1,
      }}
      aria-hidden={collapsed}
    >
      <div className="heng-container flex h-9 items-center justify-center gap-4">
        <span aria-hidden="true" className="h-px w-6" style={{ background: 'var(--color-gold)' }} />
        <p className="truncate font-body text-[11px] uppercase tracking-eyebrow text-ivory/80">
          {text}
        </p>
        {href && linkLabel && (
          <Link
            href={href}
            className="link-gold hidden shrink-0 font-body text-[11px] uppercase tracking-eyebrow text-gold sm:inline-block"
            tabIndex={collapsed ? -1 : 0}
          >
            {linkLabel}
          </Link>
        )}
        <span aria-hidden="true" className="h-px w-6" style={{ background: 'var(--color-gold)' }} />
      </div>
    </div>
  );
}
