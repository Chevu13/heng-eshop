'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { FINISHES } from '@/lib/data/fixtures';

const SORTS = [
  { value: 'najnovije', label: 'Podrazumevano' },
  { value: 'izdvojeno', label: 'Izdvojeno' },
  { value: 'cena-rastuce', label: 'Cena, od najniže' },
  { value: 'cena-opadajuce', label: 'Cena, od najviše' },
];

const AVAILABILITY = [{ value: 'na-upit', label: 'Cena na upit' }];

const plural = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'proizvod' : 'proizvoda');

/**
 * Traka iznad mreže: „Filter:” sa padajućim listama levo, sortiranje i broj
 * proizvoda desno, aktivni filteri kao oznake ispod. Stanje je u URL-u.
 */
export function CatalogFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const bar = useRef<HTMLDivElement>(null);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      bar.current?.querySelectorAll('details[open]').forEach((d) => d.removeAttribute('open'));
    },
    [params, pathname, router],
  );

  // Padajuća lista se zatvara klikom van nje.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      bar.current?.querySelectorAll('details[open]').forEach((d) => {
        if (!d.contains(e.target as Node)) d.removeAttribute('open');
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const finish = params.get('finish');
  const availability = params.get('availability');
  const sort = params.get('sort') ?? 'najnovije';

  const groups = [
    { key: 'finish', label: 'Završna obrada', value: finish, options: FINISHES.map((f) => ({ value: f.code, label: f.name, swatch: f.swatch })) },
    { key: 'availability', label: 'Cena', value: availability, options: AVAILABILITY.map((a) => ({ ...a, swatch: undefined as string | undefined })) },
  ];
  const active = groups.flatMap((g) =>
    g.options.filter((o) => o.value === g.value).map((o) => ({ key: g.key, label: o.label })),
  );

  return (
    <div ref={bar}>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 font-body text-[14px]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-ink/60">Filter:</span>
          {groups.map((g) => (
            <details key={g.key} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-ink hover:text-maroon [&::-webkit-details-marker]:hidden">
                {g.label}
                {g.value && <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-label="aktivno" />}
                <svg aria-hidden="true" viewBox="0 0 10 6" className="h-[6px] w-[10px] transition-transform group-open:rotate-180">
                  <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </summary>
              <ul className="absolute left-0 top-full z-30 mt-3 min-w-[220px] rounded-sm border border-ink/12 bg-ivory-2 p-2 shadow-[0_12px_32px_rgba(28,20,22,0.12)]">
                {g.options.map((o) => {
                  const on = g.value === o.value;
                  return (
                    <li key={o.value}>
                      <button
                        type="button"
                        onClick={() => setParam(g.key, on ? null : o.value)}
                        aria-pressed={on}
                        className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left hover:bg-ink/5"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-4 w-4 items-center justify-center rounded-sm border border-ink/30"
                          style={{ background: on ? 'var(--color-maroon)' : 'transparent', borderColor: on ? 'var(--color-maroon)' : undefined }}
                        >
                          {on && <svg viewBox="0 0 10 8" className="h-2 w-2.5"><path d="M1 4l3 3 5-6" fill="none" stroke="#EFEAE4" strokeWidth="1.5" /></svg>}
                        </span>
                        {o.swatch && <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-ink/15" style={{ background: o.swatch }} />}
                        {o.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </details>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <span className="text-ink/60">Sortiraj:</span>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value === 'najnovije' ? null : e.target.value)}
              className="cursor-pointer bg-transparent pr-1 text-ink outline-none"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <span className="text-ink/60" aria-live="polite">{total} {plural(total)}</span>
        </div>
      </div>

      {active.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {active.map((a) => (
            <button
              key={a.key}
              onClick={() => setParam(a.key, null)}
              className="flex items-center gap-2 rounded-full border border-ink/20 px-3 py-1.5 font-body text-[13px] hover:border-ink/40"
            >
              {a.label} <span aria-hidden="true">×</span>
              <span className="sr-only">— ukloni filter</span>
            </button>
          ))}
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="ml-2 font-body text-[13px] text-ink/60 underline underline-offset-4 hover:text-ink"
          >
            Poništi sve
          </button>
        </div>
      )}
    </div>
  );
}
