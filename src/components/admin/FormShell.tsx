'use client';

import { useState, useTransition, type ReactNode } from 'react';
import type { ActionResult } from '@/lib/admin/actions';

/** Omotač forme sa jedinstvenim prikazom rezultata i stanja slanja. */
export function FormShell({
  action, submitLabel = 'Sačuvaj', children, className = '',
}: {
  action: (fd: FormData) => Promise<ActionResult>;
  submitLabel?: string; children: ReactNode; className?: string;
}) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className={className}
      action={(fd) => start(async () => setResult(await action(fd)))}
    >
      {children}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Čuvanje…' : submitLabel}
        </button>
        {result && (
          <p
            role="status"
            className="font-body text-[13px]"
            style={{ color: result.ok ? '#4B262D' : 'var(--color-magenta)' }}
          >
            {result.message}
          </p>
        )}
      </div>
    </form>
  );
}

/** Dugme koje pokreće akciju bez forme (uz opcionu potvrdu). */
export function ActionButton({
  action, label, confirm, tone = 'outline', pendingLabel = 'Molimo sačekajte…',
}: {
  action: () => Promise<ActionResult>;
  label: string; confirm?: string;
  tone?: 'outline' | 'primary' | 'danger' | 'link'; pendingLabel?: string;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<ActionResult | null>(null);

  function run() {
    if (confirm && !window.confirm(confirm)) return;
    start(async () => setMsg(await action()));
  }

  const className =
    tone === 'link'
      ? 'link-gold font-body text-[11px] uppercase tracking-eyebrow disabled:opacity-40'
      : `btn ${tone === 'primary' ? 'btn-primary' : 'btn-outline'}`;

  return (
    <span className="inline-flex items-center gap-3">
      <button
        onClick={run}
        disabled={pending}
        className={className}
        style={
          tone === 'danger'
            ? { borderColor: 'rgba(198,23,143,0.4)', color: 'var(--color-magenta)' }
            : tone === 'link'
              ? { color: 'var(--color-magenta)' }
              : undefined
        }
      >
        {pending ? pendingLabel : label}
      </button>
      {msg && !msg.ok && (
        <span role="alert" className="font-body text-[12px]" style={{ color: 'var(--color-magenta)' }}>
          {msg.message}
        </span>
      )}
    </span>
  );
}
