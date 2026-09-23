'use client';

import { useState } from 'react';
import { saveGallery } from '@/lib/admin/actions';
import { resolveMediaUrl } from '@/lib/admin/media';
import type { GalleryItem } from '@/components/home/InspirationGallery';
import { FormShell } from './FormShell';

/** Cela galerija se čuva odjednom — redosled u listi je redosled na sajtu. */
export function GalleryEditor({ items: initial }: { items: GalleryItem[] }) {
  const [items, setItems] = useState(initial);

  const set = (i: number, patch: Partial<GalleryItem>) =>
    setItems((list) => list.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, d: number) =>
    setItems((list) => {
      const next = [...list];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  const small = 'link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/55 disabled:opacity-30';

  return (
    <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
      <div className="mb-5">
        <h2 className="font-display text-[18px]" style={{ fontWeight: 600 }}>Galerija</h2>
        <p className="mt-1 font-body text-[13px] text-ink/55">
          Fotografije ispod članaka. Otpremite ih u <a href="/admin/mediji" target="_blank" className="link-gold">Medije</a> i
          nalepite putanju.
        </p>
      </div>

      <FormShell action={saveGallery} submitLabel="Sačuvaj galeriju">
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <ul className="space-y-4">
          {items.map((it, i) => (
            <li key={i} className="flex gap-4 rounded-sm border border-ink/10 p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-ink/5">
                {it.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolveMediaUrl(it.url)} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="grid min-w-0 flex-1 gap-3">
                <input className="field" placeholder="URL ili putanja *" value={it.url} onChange={(e) => set(i, { url: e.target.value })} />
                <input className="field" placeholder="Natpis (prikazuje se na hover)" value={it.caption ?? ''} onChange={(e) => set(i, { caption: e.target.value })} />
                <input className="field" placeholder="Opis fotografije (alt)" value={it.alt} onChange={(e) => set(i, { alt: e.target.value })} />
                <div className="flex gap-5">
                  <button type="button" className={small} disabled={i === 0} onClick={() => move(i, -1)}>Gore</button>
                  <button type="button" className={small} disabled={i === items.length - 1} onClick={() => move(i, 1)}>Dole</button>
                  <button
                    type="button" className={small} style={{ color: 'var(--color-magenta)' }}
                    onClick={() => setItems((list) => list.filter((_, j) => j !== i))}
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setItems((list) => [...list, { url: '', alt: '', caption: '' }])}
          className="btn btn-outline mt-5"
        >
          Dodaj fotografiju
        </button>
      </FormShell>
    </section>
  );
}
