'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const STATUSES = [
  { value: '', label: 'Svi' },
  { value: 'nova', label: 'Nova' },
  { value: 'potvrdjena', label: 'Potvrđena' },
  { value: 'u_pripremi', label: 'U pripremi' },
  { value: 'poslata', label: 'Poslata' },
  { value: 'zavrsena', label: 'Završena' },
  { value: 'otkazana', label: 'Otkazana' },
];

function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const status = params.get('status') ?? '';

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-end gap-6">
      <form onSubmit={(e) => { e.preventDefault(); set('q', q.trim()); }}>
        <label htmlFor="pretraga-porudzbina" className="field-label">Pretraga</label>
        <input
          id="pretraga-porudzbina" type="search" value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Broj, ime ili email"
          className="field w-[240px]"
        />
      </form>

      <div>
        <span className="field-label" id="filter-status">Status</span>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="filter-status">
          {STATUSES.map((s) => {
            const on = status === s.value;
            return (
              <button
                key={s.value || 'sve'}
                onClick={() => set('status', s.value)}
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
    </div>
  );
}

export function OrderFilters() {
  return (
    <Suspense fallback={<div className="h-20" />}>
      <Filters />
    </Suspense>
  );
}
