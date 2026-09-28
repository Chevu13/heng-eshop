'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export interface FacetOption { value: string; label: string; count: number; swatch?: string }
export interface Facet { key: string; label: string; options: FacetOption[] }

const SORTS = [
  { value: 'najnovije', label: 'Podrazumevano' },
  { value: 'izdvojeno', label: 'Izdvojeno' },
  { value: 'cena-rastuce', label: 'Cena, od najniže' },
  { value: 'cena-opadajuce', label: 'Cena, od najviše' },
];

const plural = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'proizvod' : 'proizvoda');

type Selected = Record<string, string[]>;

/** Filteri po uzoru na Shopify „Dawn”: padajuće liste na računaru, panel na telefonu. */
export function CatalogFilters({ facets, total }: { facets: Facet[]; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current: Selected = Object.fromEntries(
    facets.map((f) => [f.key, params.get(f.key)?.split(',').filter(Boolean) ?? []]),
  );
  const sort = params.get('sort') ?? 'najnovije';

  function apply(selected: Selected, nextSort = sort) {
    const next = new URLSearchParams(params.toString());
    for (const f of facets) {
      if (selected[f.key]?.length) next.set(f.key, selected[f.key].join(','));
      else next.delete(f.key);
    }
    if (nextSort === 'najnovije') next.delete('sort'); else next.set('sort', nextSort);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const toggle = (sel: Selected, key: string, value: string): Selected => ({
    ...sel,
    [key]: sel[key]?.includes(value) ? sel[key].filter((v) => v !== value) : [...(sel[key] ?? []), value],
  });

  const chips = facets.flatMap((f) =>
    f.options.filter((o) => current[f.key].includes(o.value)).map((o) => ({ key: f.key, ...o })),
  );
  const none: Selected = Object.fromEntries(facets.map((f) => [f.key, []]));

  return (
    <div className="font-body text-[14px]">
      {/* Računar */}
      <div className="hidden items-center justify-between gap-8 md:flex">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-ink/60">Filter:</span>
          {facets.map((f) => (
            <Dropdown
              key={f.key} facet={f} selected={current[f.key]}
              onToggle={(v) => apply(toggle(current, f.key, v))}
              onReset={() => apply({ ...current, [f.key]: [] })}
            />
          ))}
        </div>
        <label className="flex items-center gap-2">
          <span className="text-ink/60">Sortiraj:</span>
          <select
            value={sort} onChange={(e) => apply(current, e.target.value)}
            className="cursor-pointer bg-transparent text-ink outline-none"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {/* Telefon */}
      <MobileFilters
        facets={facets} current={current} sort={sort} total={total}
        onApply={apply} toggle={toggle} none={none}
      />

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button
              key={c.key + c.value}
              onClick={() => apply(toggle(current, c.key, c.value))}
              className="flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-[13px] hover:border-ink/40"
            >
              {c.label} <span aria-hidden="true">×</span>
              <span className="sr-only">— ukloni filter</span>
            </button>
          ))}
          <button onClick={() => apply(none)} className="ml-2 text-[13px] underline underline-offset-4">
            Poništi sve
          </button>
        </div>
      )}
    </div>
  );
}

function Checkbox({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center border"
      style={{ borderColor: on ? 'var(--color-ink)' : 'rgba(28,20,22,0.35)', background: on ? 'var(--color-ink)' : 'transparent' }}
    >
      {on && <svg viewBox="0 0 10 8" className="h-2 w-2.5"><path d="M1 4l3 3 5-6" fill="none" stroke="#fff" strokeWidth="1.6" /></svg>}
    </span>
  );
}

function OptionList({ facet, selected, onToggle }: {
  facet: Facet; selected: string[]; onToggle: (value: string) => void;
}) {
  return (
    <ul>
      {facet.options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <li key={o.value}>
            <button
              type="button" onClick={() => onToggle(o.value)} aria-pressed={on}
              disabled={!on && o.count === 0}
              className="flex w-full items-center gap-3 py-2 text-left disabled:opacity-40"
            >
              <Checkbox on={on} />
              {o.swatch && <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-ink/20" style={{ background: o.swatch }} />}
              <span>{o.label} <span className="text-ink/50">({o.count})</span></span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Dropdown({ facet, selected, onToggle, onReset }: {
  facet: Facet; selected: string[]; onToggle: (v: string) => void; onReset: () => void;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <details ref={ref} className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 hover:underline group-open:underline [&::-webkit-details-marker]:hidden">
        {facet.label}{selected.length > 0 && ` (${selected.length})`}
        <svg aria-hidden="true" viewBox="0 0 10 6" className="h-[6px] w-[10px] transition-transform group-open:rotate-180">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </summary>
      <div className="absolute left-0 top-full z-30 mt-3 w-[300px] border border-ink/10 bg-ivory shadow-[0_8px_24px_rgba(28,20,22,0.08)]">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5">
          <span className="text-ink/70">{selected.length} izabrano</span>
          <button type="button" onClick={onReset} className="underline underline-offset-4">Poništi</button>
        </div>
        <div className="max-h-[320px] overflow-y-auto px-5 py-2">
          <OptionList facet={facet} selected={selected} onToggle={onToggle} />
        </div>
      </div>
    </details>
  );
}

function MobileFilters({ facets, current, sort, total, onApply, toggle, none }: {
  facets: Facet[]; current: Selected; sort: string; total: number;
  onApply: (s: Selected, sort?: string) => void;
  toggle: (s: Selected, key: string, value: string) => Selected; none: Selected;
}) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const [draft, setDraft] = useState<Selected>(current);
  const [draftSort, setDraftSort] = useState(sort);

  function show() { setDraft(current); setDraftSort(sort); setPanel(null); setOpen(true); }
  function close() { setOpen(false); }
  function commit() { onApply(draft, draftSort); setOpen(false); }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [open]);

  const facet = facets.find((f) => f.key === panel);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between">
        <button onClick={show} className="flex items-center gap-2.5 py-1 text-[15px]" aria-haspopup="dialog">
          <svg aria-hidden="true" viewBox="0 0 20 14" className="h-3.5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M0 3.5h7M12 3.5h8M0 10.5h11M16 10.5h4" /><circle cx="9.5" cy="3.5" r="2.3" /><circle cx="13.5" cy="10.5" r="2.3" />
          </svg>
          Filter
        </button>
        <span className="text-ink/60">{total} {plural(total)}</span>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Filteri">
          <button aria-label="Zatvori" className="absolute inset-0 bg-ink/40" onClick={close} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-[380px] flex-col bg-ivory-2">
            <div className="relative border-b border-ink/10 px-6 py-4 text-center">
              <p className="font-medium">Filter</p>
              <p className="text-[13px] text-ink/60">{total} {plural(total)}</p>
              <button onClick={close} aria-label="Zatvori filtere" className="absolute right-4 top-1/2 -translate-y-1/2 p-2">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 2l12 12M14 2L2 14" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {facet ? (
                <>
                  <button onClick={() => setPanel(null)} className="flex items-center gap-3 py-5 text-[16px]">
                    <span aria-hidden="true">←</span> {facet.label}
                  </button>
                  <OptionList
                    facet={facet} selected={draft[facet.key] ?? []}
                    onToggle={(v) => setDraft((d) => toggle(d, facet.key, v))}
                  />
                </>
              ) : (
                <ul>
                  {facets.map((f) => (
                    <li key={f.key}>
                      <button onClick={() => setPanel(f.key)} className="flex w-full items-center justify-between py-5 text-left text-[16px]">
                        <span>{f.label}{draft[f.key]?.length ? ` (${draft[f.key].length})` : ''}</span>
                        <span aria-hidden="true" className="text-ink/50">→</span>
                      </button>
                    </li>
                  ))}
                  <li className="flex items-center justify-between py-5 text-[16px]">
                    <label htmlFor="m-sort">Sortiraj:</label>
                    <select id="m-sort" value={draftSort} onChange={(e) => setDraftSort(e.target.value)} className="bg-transparent text-[14px] outline-none">
                      {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </li>
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 items-center gap-4 border-t border-ink/10 px-6 py-4">
              <button
                onClick={() => (facet ? setDraft((d) => ({ ...d, [facet.key]: [] })) : setDraft(none))}
                className="underline underline-offset-4"
              >
                {facet ? 'Poništi' : 'Poništi sve'}
              </button>
              <button onClick={commit} className="bg-ink py-3 font-medium text-ivory">Primeni</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
