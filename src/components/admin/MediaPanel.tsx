'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductMedia, ProductVariant } from '@/types';
import { FormShell, ActionButton } from './FormShell';
import { attachMedia, detachMedia, updateMedia } from '@/lib/admin/actions';
import { resolveMediaUrl } from '@/lib/admin/media';

export function MediaPanel({ productId, media, variants }: {
  productId: string; media: ProductMedia[]; variants: ProductVariant[];
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const sorted = [...media].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[18px]" style={{ fontWeight: 600 }}>Galerija</h2>
          <p className="mt-1 font-body text-[13px] text-ink/55">
            Fajlove prvo otpremite u <a href="/admin/mediji" className="link-gold">Medije</a>, zatim ih
            ovde povežite sa proizvodom i obradom.
          </p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="btn btn-outline">
          {adding ? 'Otkaži' : 'Dodaj medij'}
        </button>
      </div>

      {adding && (
        <div className="mb-6 rounded-sm border border-dashed border-gold/50 p-5">
          <FormShell action={(fd) => attachMedia(productId, fd)} submitLabel="Dodaj u galeriju">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label">URL ili putanja *</label>
                <input
                  name="url" required className="field"
                  placeholder="/assets/heng/products/model-01/model-01-crna-mat.jpg"
                />
              </div>
              <div>
                <label className="field-label">Tip</label>
                <select name="kind" className="field cursor-pointer" defaultValue="image">
                  <option value="image">Fotografija</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="field-label">Vezano za obradu</label>
                <select name="variant_id" className="field cursor-pointer" defaultValue="">
                  <option value="">Bez veze sa obradom</option>
                  {variants.map((v) => <option key={v.id} value={v.id}>{v.finish_name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Poster (za video)</label>
                <input name="poster_url" className="field" placeholder="Obavezno kada je tip video" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Alt tekst *</label>
                <input
                  name="alt" className="field"
                  placeholder="Model 01 u crnoj mat obradi"
                />
                <p className="mt-1.5 font-body text-[12px] text-ink/45">
                  Opisni tekst je obavezan za fotografije proizvoda — koriste ga čitači ekrana i pretraživači.
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-ink/12 p-4">
                  <input type="checkbox" name="is_cover" className="accent-[color:var(--color-maroon)]" />
                  <span className="font-body text-[14px]">Naslovna fotografija</span>
                </label>
              </div>
            </div>
          </FormShell>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="rounded-sm border border-dashed border-ink/18 px-6 py-10 text-center font-body text-[14px] text-ink/50">
          Galerija je prazna. Proizvod bez fotografije prikazuje se sa oznakom „Fotografija u pripremi”.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((m) => (
            <li key={m.id} className="rounded-sm border border-ink/12">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-sm bg-ivory">
                {m.kind === 'video' ? (
                  <video
                    src={resolveMediaUrl(m.url)}
                    poster={m.poster_url ? resolveMediaUrl(m.poster_url) : undefined}
                    className="h-full w-full object-cover" muted playsInline
                  />
                ) : (
                  <Image src={resolveMediaUrl(m.url)} alt={m.alt ?? ''} fill sizes="240px" className="object-cover" />
                )}
                {m.is_cover && (
                  <span
                    className="absolute left-2 top-2 rounded-sm px-2 py-1 font-body text-[10px] uppercase tracking-eyebrow"
                    style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}
                  >
                    Naslovna
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="line-clamp-2 font-body text-[12px] text-ink/60">
                  {m.alt || <span className="text-magenta">Nedostaje alt tekst</span>}
                </p>
                <p className="mt-1 font-body text-[11px] text-ink/35">Redosled: {m.sort_order}</p>

                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => setEditing(editing === m.id ? null : m.id)}
                    className="link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/55"
                  >
                    {editing === m.id ? 'Zatvori' : 'Uredi'}
                  </button>
                  <ActionButton
                    action={() => detachMedia(productId, m.id)}
                    label="Ukloni" tone="link" pendingLabel="Uklanjanje…"
                    confirm="Ukloniti medij sa proizvoda? Fajl ostaje u Medijima."
                  />
                </div>

                {editing === m.id && (
                  <div className="mt-4 border-t border-ink/10 pt-4">
                    <FormShell action={(fd) => updateMedia(productId, m.id, fd)}>
                      <div className="space-y-4">
                        <div>
                          <label className="field-label">Alt tekst</label>
                          <input name="alt" className="field" defaultValue={m.alt ?? ''} />
                        </div>
                        <div>
                          <label className="field-label">Redosled</label>
                          <input name="sort_order" type="number" className="field" defaultValue={m.sort_order} />
                        </div>
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox" name="is_cover" defaultChecked={m.is_cover}
                            className="accent-[color:var(--color-maroon)]"
                          />
                          <span className="font-body text-[13px]">Naslovna fotografija</span>
                        </label>
                      </div>
                    </FormShell>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
