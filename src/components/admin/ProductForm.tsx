'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Category, ProductFull } from '@/types';
import { FormShell } from './FormShell';
import { saveProduct } from '@/lib/admin/actions';
import { slugify } from '@/lib/format';

function Field({ label, children, hint, wide = false }: {
  label: string; children: React.ReactNode; hint?: string; wide?: boolean;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <p className="mt-1.5 font-body text-[12px] text-ink/45">{hint}</p>}
    </div>
  );
}

function Check({ name, label, defaultChecked, hint }: {
  name: string; label: string; defaultChecked?: boolean; hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-ink/12 p-4">
      <input
        type="checkbox" name={name} defaultChecked={defaultChecked}
        className="mt-0.5 accent-[color:var(--color-maroon)]"
      />
      <span>
        <span className="block font-body text-[14px]">{label}</span>
        {hint && <span className="mt-1 block font-body text-[12px] text-ink/50">{hint}</span>}
      </span>
    </label>
  );
}

export function ProductForm({ product, categories }: {
  product: ProductFull | null; categories: Category[];
}) {
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [onRequest, setOnRequest] = useState(product?.price_on_request ?? true);

  return (
    <FormShell
      action={(fd) => saveProduct(product?.id ?? null, fd)}
      submitLabel={product ? 'Sačuvaj izmene' : 'Kreiraj proizvod'}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
            <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>Osnovno</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Naziv *">
                <input
                  name="name" required className="field" value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                />
              </Field>
              <Field label="Slug *" hint="Adresa: /proizvod/{slug}">
                <input
                  name="slug" required className="field" value={slug}
                  onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
                />
              </Field>
              <Field label="Kategorija">
                <select name="category_id" className="field cursor-pointer" defaultValue={product?.category_id ?? ''}>
                  <option value="">Bez kategorije</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </Field>
              <Field label="Šifra (SKU)">
                <input name="sku" className="field" defaultValue={product?.sku ?? ''} />
              </Field>
              <Field label="Kratak opis" wide hint="Prikazuje se ispod naziva na stranici proizvoda.">
                <textarea name="short_description" rows={3} className="field resize-y" defaultValue={product?.short_description ?? ''} />
              </Field>
              <Field label="Pun opis" wide>
                <textarea name="description" rows={7} className="field resize-y" defaultValue={product?.description ?? ''} />
              </Field>
            </div>
          </section>

          <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
            <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>Specifikacija</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Materijal">
                <input name="material" className="field" defaultValue={product?.material ?? 'Eloksirana legura aluminijuma'} />
              </Field>
              <Field label="Dimenzije" hint="npr. 31,5 × 8,6 × 2 cm">
                <input name="dimensions" className="field" defaultValue={product?.dimensions ?? ''} />
              </Field>
              <Field label="Tehničke informacije" wide>
                <textarea name="technical_info" rows={5} className="field resize-y" defaultValue={product?.technical_info ?? ''} />
              </Field>
              <Field label="Montaža" wide>
                <textarea name="installation_info" rows={4} className="field resize-y" defaultValue={product?.installation_info ?? ''} />
              </Field>
              <Field label="Informacije o isporuci" wide>
                <textarea name="delivery_info" rows={3} className="field resize-y" defaultValue={product?.delivery_info ?? ''} />
              </Field>
              <Field label="Oznake" wide hint="Odvojene zarezom — koriste se u pretrazi kataloga.">
                <input name="tags" className="field" defaultValue={(product?.tags ?? []).join(', ')} />
              </Field>
            </div>
          </section>

          <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
            <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>SEO</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="SEO naslov" wide>
                <input name="seo_title" className="field" maxLength={160} defaultValue={product?.seo_title ?? ''} />
              </Field>
              <Field label="SEO opis" wide hint="Preporuka: do 160 karaktera.">
                <textarea name="seo_description" rows={3} className="field resize-y" maxLength={300} defaultValue={product?.seo_description ?? ''} />
              </Field>
              <Field label="OG slika" wide hint="Putanja iz Medija ili /assets/... adresa.">
                <input name="og_image" className="field" defaultValue={product?.og_image ?? ''} />
              </Field>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
            <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>Vidljivost</h2>
            <div className="space-y-3">
              <Check name="is_published" label="Objavljen" defaultChecked={product?.is_published ?? false}
                     hint="Nacrt se ne prikazuje na sajtu." />
              <Check name="is_featured" label="Izdvojen" defaultChecked={product?.is_featured ?? false}
                     hint="Pojavljuje se u sekciji na početnoj strani." />
            </div>
            <div className="mt-5">
              <Field label="Redosled" hint="Manji broj — više u listi.">
                <input name="sort_order" type="number" className="field" defaultValue={product?.sort_order ?? 0} />
              </Field>
            </div>
          </section>

          <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
            <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>Cena i zaliha</h2>

            <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-ink/12 p-4">
              <input
                type="checkbox" name="price_on_request" checked={onRequest}
                onChange={(e) => setOnRequest(e.target.checked)}
                className="mt-0.5 accent-[color:var(--color-maroon)]"
              />
              <span>
                <span className="block font-body text-[14px]">Cena na upit</span>
                <span className="mt-1 block font-body text-[12px] text-ink/50">
                  Na sajtu se prikazuje „Cena na upit”, bez iznosa.
                </span>
              </span>
            </label>

            <div className="mt-5 space-y-5" style={{ opacity: onRequest ? 0.45 : 1 }}>
              <Field label="Redovna cena (RSD)">
                <input
                  name="price_rsd" type="number" step="0.01" min="0" className="field"
                  disabled={onRequest} defaultValue={product?.price_rsd ?? ''}
                />
              </Field>
              <Field label="Akcijska cena (RSD)" hint="Mora biti niža od redovne.">
                <input
                  name="sale_price_rsd" type="number" step="0.01" min="0" className="field"
                  disabled={onRequest} defaultValue={product?.sale_price_rsd ?? ''}
                />
              </Field>
              <Field label="Akcija — od">
                <input
                  name="sale_starts_at" type="datetime-local" className="field" disabled={onRequest}
                  defaultValue={product?.sale_starts_at?.slice(0, 16) ?? ''}
                />
              </Field>
              <Field label="Akcija — do">
                <input
                  name="sale_ends_at" type="datetime-local" className="field" disabled={onRequest}
                  defaultValue={product?.sale_ends_at?.slice(0, 16) ?? ''}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Zaliha" hint="Kada proizvod ima varijante, merodavna je zaliha varijante.">
                <input name="stock" type="number" min="0" className="field" defaultValue={product?.stock ?? 0} />
              </Field>
            </div>
          </section>

          {product && (
            <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
              <h2 className="mb-3 font-display text-[18px]" style={{ fontWeight: 600 }}>Na sajtu</h2>
              <Link
                href={`/proizvod/${product.slug}`} target="_blank"
                className="link-gold font-body text-[13px]"
              >
                Otvori stranicu proizvoda →
              </Link>
            </section>
          )}
        </div>
      </div>
    </FormShell>
  );
}
