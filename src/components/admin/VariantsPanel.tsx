'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductVariant } from '@/types';
import { FormShell, ActionButton } from './FormShell';
import { saveVariant, deleteVariant } from '@/lib/admin/actions';
import { resolveMediaUrl } from '@/lib/admin/media';
import { FINISHES } from '@/lib/data/fixtures';

function VariantFields({ variant }: { variant: ProductVariant | null }) {
  const [swatch, setSwatch] = useState(variant?.finish_swatch ?? '#1C1416');

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label className="field-label">Naziv obrade *</label>
        <input
          name="finish_name" required className="field" list="obrade-lista"
          defaultValue={variant?.finish_name ?? ''}
        />
        <datalist id="obrade-lista">
          {FINISHES.map((f) => <option key={f.code} value={f.name} />)}
        </datalist>
      </div>
      <div>
        <label className="field-label">Kod obrade</label>
        <input
          name="finish_code" className="field" placeholder="crna-mat"
          defaultValue={variant?.finish_code ?? ''}
        />
      </div>
      <div>
        <label className="field-label">Uzorak (boja)</label>
        <div className="flex gap-2">
          <input
            type="color" aria-label="Izbor boje uzorka" value={swatch}
            onChange={(e) => setSwatch(e.target.value)}
            className="h-[46px] w-14 cursor-pointer rounded-sm border border-ink/15 bg-transparent p-1"
          />
          <input
            name="finish_swatch" className="field" value={swatch}
            onChange={(e) => setSwatch(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="field-label">SKU</label>
        <input name="sku" className="field" defaultValue={variant?.sku ?? ''} />
      </div>
      <div>
        <label className="field-label">Cena (RSD)</label>
        <input
          name="price_rsd" type="number" step="0.01" min="0" className="field"
          placeholder="Nasleđuje se sa proizvoda"
          defaultValue={variant?.price_rsd ?? ''}
        />
      </div>
      <div>
        <label className="field-label">Akcijska cena (RSD)</label>
        <input
          name="sale_price_rsd" type="number" step="0.01" min="0" className="field"
          defaultValue={variant?.sale_price_rsd ?? ''}
        />
      </div>
      <div>
        <label className="field-label">Zaliha</label>
        <input name="stock" type="number" min="0" className="field" defaultValue={variant?.stock ?? 0} />
      </div>
      <div>
        <label className="field-label">Dimenzije</label>
        <input name="dimensions" className="field" defaultValue={variant?.dimensions ?? ''} />
      </div>
      <div>
        <label className="field-label">Redosled</label>
        <input name="sort_order" type="number" className="field" defaultValue={variant?.sort_order ?? 0} />
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <label className="field-label">Glavna fotografija</label>
        <input
          name="main_image" className="field"
          placeholder="/assets/heng/products/model-01/model-01-crna-mat.jpg ili putanja iz Medija"
          defaultValue={variant?.main_image ?? ''}
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-ink/12 p-4">
          <input
            type="checkbox" name="is_active" defaultChecked={variant?.is_active ?? true}
            className="accent-[color:var(--color-maroon)]"
          />
          <span className="font-body text-[14px]">Aktivna — vidljiva u izboru obrade na sajtu</span>
        </label>
      </div>
    </div>
  );
}

export function VariantsPanel({ productId, variants }: {
  productId: string; variants: ProductVariant[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[18px]" style={{ fontWeight: 600 }}>Varijante i obrade</h2>
          <p className="mt-1 font-body text-[13px] text-ink/55">
            Cena i zaliha varijante imaju prednost nad vrednostima proizvoda.
          </p>
        </div>
        <button onClick={() => { setAdding((v) => !v); setEditing(null); }} className="btn btn-outline">
          {adding ? 'Otkaži' : 'Dodaj varijantu'}
        </button>
      </div>

      {adding && (
        <div className="mb-6 rounded-sm border border-dashed border-gold/50 p-5">
          <FormShell action={(fd) => saveVariant(productId, null, fd)} submitLabel="Dodaj varijantu">
            <VariantFields variant={null} />
          </FormShell>
        </div>
      )}

      {variants.length === 0 && !adding ? (
        <p className="rounded-sm border border-dashed border-ink/18 px-6 py-10 text-center font-body text-[14px] text-ink/50">
          Proizvod još nema varijante. Bez njih se prikazuje samo cena i zaliha proizvoda.
        </p>
      ) : (
        <ul className="space-y-3">
          {variants.map((v) => (
            <li key={v.id} className="rounded-sm border border-ink/12">
              <div className="flex flex-wrap items-center gap-4 p-4">
                <span
                  aria-hidden="true"
                  className="block h-9 w-9 shrink-0 rounded-sm ring-1 ring-inset ring-ink/15"
                  style={{ background: v.finish_swatch ?? '#8C8477' }}
                />
                {v.main_image && (
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-ivory">
                    <Image src={resolveMediaUrl(v.main_image)} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-body text-[14px]">
                    {v.finish_name}
                    {!v.is_active && <span className="ml-2 text-ink/40">(neaktivna)</span>}
                  </p>
                  <p className="font-body text-[12px] text-ink/50">
                    {v.sku ?? '—'} · zaliha {v.stock} · {v.dimensions ?? 'bez dimenzija'}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setEditing(editing === v.id ? null : v.id); setAdding(false); }}
                    className="link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/55"
                  >
                    {editing === v.id ? 'Zatvori' : 'Uredi'}
                  </button>
                  <ActionButton
                    action={() => deleteVariant(productId, v.id)}
                    label="Obriši"
                    tone="link"
                    pendingLabel="Brisanje…"
                    confirm={`Obrisati varijantu „${v.finish_name}”? Radnja je nepovratna.`}
                  />
                </div>
              </div>

              {editing === v.id && (
                <div className="border-t border-ink/10 p-5">
                  <FormShell action={(fd) => saveVariant(productId, v.id, fd)}>
                    <VariantFields variant={v} />
                  </FormShell>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
