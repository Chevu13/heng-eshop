'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import type { Category } from '@/types';
import { FINISHES } from '@/lib/data/fixtures';

const SORTS = [
  { value: 'najnovije', label: 'Podrazumevano' },
  { value: 'izdvojeno', label: 'Izdvojeno' },
  { value: 'cena-rastuce', label: 'Cena — rastuće' },
  { value: 'cena-opadajuce', label: 'Cena — opadajuće' },
];

const AVAILABILITY = [
  { value: 'na-stanju', label: 'Na stanju' },
  { value: 'na-upit', label: 'Na upit' },
];

/** Filteri se drže u URL-u — stanje je deljivo i preživljava osvežavanje. */
export function CatalogFilters({
  categories, activeCategory, total,
}: { categories: Category[]; activeCategory?: string; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const finish = params.get('finish');
  const availability = params.get('availability');
  const sort = params.get('sort') ?? 'najnovije';
  const hasFilters = Boolean(finish || availability || params.get('q') || (sort !== 'najnovije'));

  return (
    <div>
      <nav aria-label="Kategorije">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <li>
            <Link
              href="/kolekcija"
              className="link-gold font-body text-[13px] uppercase tracking-eyebrow"
              style={{ color: !activeCategory ? 'var(--color-maroon)' : 'rgba(28,20,22,0.5)' }}
              aria-current={!activeCategory ? 'page' : undefined}
            >
              Sve
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/kolekcija/${cat.slug}`}
                className="link-gold font-body text-[13px] uppercase tracking-eyebrow"
                style={{ color: activeCategory === cat.slug ? 'var(--color-maroon)' : 'rgba(28,20,22,0.5)' }}
                aria-current={activeCategory === cat.slug ? 'page' : undefined}
              >
                {cat.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="heng-rule my-8" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
          <form
            onSubmit={(e) => { e.preventDefault(); setParam('q', q.trim() || null); }}
            className="w-full sm:w-auto"
          >
            <label htmlFor="katalog-pretraga" className="field-label">Pretraga</label>
            <input
              id="katalog-pretraga" type="search" value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Model, obrada, dimenzija…"
              className="field sm:w-[220px]"
            />
          </form>

          <div>
            <span className="field-label" id="filter-obrada">Završna obrada</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="filter-obrada">
              {FINISHES.map((f) => {
                const on = finish === f.code;
                return (
                  <button
                    key={f.code}
                    onClick={() => setParam('finish', on ? null : f.code)}
                    aria-pressed={on}
                    className="flex items-center gap-2 rounded-sm border px-3 py-2 font-body text-[12px] transition-colors duration-200"
                    style={{
                      borderColor: on ? 'var(--color-gold)' : 'rgba(28,20,22,0.16)',
                      color: on ? 'var(--color-maroon)' : 'rgba(28,20,22,0.6)',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="block h-3 w-3 rounded-sm ring-1 ring-inset ring-ink/15"
                      style={{ background: f.swatch }}
                    />
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="field-label" id="filter-dostupnost">Dostupnost</span>
            <div className="flex gap-2" role="group" aria-labelledby="filter-dostupnost">
              {AVAILABILITY.map((a) => {
                const on = availability === a.value;
                return (
                  <button
                    key={a.value}
                    onClick={() => setParam('availability', on ? null : a.value)}
                    aria-pressed={on}
                    className="rounded-sm border px-3 py-2 font-body text-[12px] transition-colors duration-200"
                    style={{
                      borderColor: on ? 'var(--color-gold)' : 'rgba(28,20,22,0.16)',
                      color: on ? 'var(--color-maroon)' : 'rgba(28,20,22,0.6)',
                    }}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-end gap-6">
          <div>
            <label htmlFor="katalog-sort" className="field-label">Sortiranje</label>
            <select
              id="katalog-sort" value={sort}
              onChange={(e) => setParam('sort', e.target.value === 'najnovije' ? null : e.target.value)}
              className="field w-[190px] cursor-pointer"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button
              onClick={() => { setQ(''); router.push(pathname, { scroll: false }); }}
              className="link-gold pb-3 font-body text-[12px] uppercase tracking-eyebrow text-ink/50"
            >
              Poništi
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 font-body text-[13px] text-ink/45" aria-live="polite">
        {total} {total === 1 ? 'proizvod' : total >= 2 && total <= 4 ? 'proizvoda' : 'proizvoda'}
      </p>
    </div>
  );
}
