'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import type { ProjectInquiry } from '@/types';
import { FormShell } from './FormShell';
import { updateInquiry, inquiryAttachmentUrl } from '@/lib/admin/actions';
import { Badge } from './AdminUI';
import { formatDate, statusLabel } from '@/lib/format';

const STATUSES = [
  { value: '', label: 'Svi' },
  { value: 'nov', label: 'Nov' },
  { value: 'kontaktiran', label: 'Kontaktiran' },
  { value: 'zavrsen', label: 'Završen' },
];

function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const status = params.get('status') ?? '';

  return (
    <div>
      <span className="field-label" id="filter-upiti">Status</span>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="filter-upiti">
        {STATUSES.map((s) => {
          const on = status === s.value;
          return (
            <button
              key={s.value || 'svi'}
              onClick={() => router.push(s.value ? `${pathname}?status=${s.value}` : pathname)}
              aria-pressed={on}
              className="rounded-sm border px-3 py-2 font-body text-[12px] transition-colors duration-200"
              style={{
                borderColor: on ? 'var(--color-gold)' : 'rgba(28,20,22,0.16)',
                color: on ? 'var(--color-maroon)' : 'rgba(28,20,22,0.6)',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InquiryFilters() {
  return <Suspense fallback={<div className="h-16" />}><Filters /></Suspense>;
}

function Attachment({ path }: { path: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function open() {
    setBusy(true);
    setError(false);
    const url = await inquiryAttachmentUrl(path);
    setBusy(false);
    if (url) window.open(url, '_blank', 'noopener');
    else setError(true);
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button onClick={open} disabled={busy} className="link-gold font-body text-[12px] uppercase tracking-eyebrow">
        {busy ? 'Otvaranje…' : 'Otvori prilog'}
      </button>
      {error && (
        <span role="alert" className="font-body text-[12px]" style={{ color: 'var(--color-magenta)' }}>
          Prilog nije dostupan.
        </span>
      )}
    </span>
  );
}

export function InquiryCard({ inquiry: q }: { inquiry: ProjectInquiry }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-sm border border-ink/12 bg-white/60">
      <div className="flex flex-wrap items-start gap-4 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-body text-[15px]">{q.full_name}</p>
            <Badge tone={q.status === 'nov' ? 'gold' : q.status === 'zavrsen' ? 'neutral' : 'muted'}>
              {statusLabel(q.status)}
            </Badge>
            {q.project_type && <Badge tone="muted">{q.project_type}</Badge>}
          </div>
          <p className="mt-1 font-body text-[12px] text-ink/45">
            {[q.company, q.location, formatDate(q.created_at)].filter(Boolean).join(' · ')}
          </p>
          <p className="mt-3 line-clamp-2 max-w-[80ch] font-body text-[14px] leading-relaxed text-ink/68">
            {q.description}
          </p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="link-gold shrink-0 font-body text-[11px] uppercase tracking-eyebrow text-ink/55"
          aria-expanded={open}
        >
          {open ? 'Zatvori' : 'Otvori'}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 p-5">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <dl className="grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="field-label mb-1">Email</dt>
                  <dd><a href={`mailto:${q.email}`} className="link-gold font-body text-[14px]">{q.email}</a></dd>
                </div>
                {q.phone && (
                  <div>
                    <dt className="field-label mb-1">Telefon</dt>
                    <dd>
                      <a href={`tel:${q.phone.replace(/\s/g, '')}`} className="link-gold font-body text-[14px]">
                        {q.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {q.desired_products && (
                  <div>
                    <dt className="field-label mb-1">Željeni proizvodi</dt>
                    <dd className="font-body text-[14px] text-ink/70">{q.desired_products}</dd>
                  </div>
                )}
                {q.deadline && (
                  <div>
                    <dt className="field-label mb-1">Planirani rok</dt>
                    <dd className="font-body text-[14px] text-ink/70">{q.deadline}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="field-label mb-1">Opis projekta</dt>
                  <dd className="whitespace-pre-line font-body text-[14px] leading-relaxed text-ink/70">
                    {q.description}
                  </dd>
                </div>
                {q.attachment_url && (
                  <div className="sm:col-span-2">
                    <dt className="field-label mb-1">Prilog</dt>
                    <dd><Attachment path={q.attachment_url} /></dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <FormShell action={(fd) => updateInquiry(q.id, fd)}>
                <fieldset>
                  <legend className="field-label">Status</legend>
                  <div className="space-y-2">
                    {STATUSES.filter((s) => s.value).map((s) => (
                      <label key={s.value} className="flex cursor-pointer items-center gap-3 rounded-sm border border-ink/12 p-3">
                        <input
                          type="radio" name="status" value={s.value}
                          defaultChecked={q.status === s.value}
                          className="accent-[color:var(--color-maroon)]"
                        />
                        <span className="font-body text-[14px]">{s.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="mt-5">
                  <label htmlFor={`note-${q.id}`} className="field-label">Interna beleška</label>
                  <textarea
                    id={`note-${q.id}`} name="internal_note" rows={4}
                    className="field resize-y" defaultValue={q.internal_note ?? ''}
                  />
                </div>
              </FormShell>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
