'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Category } from '@/types';
import { FormShell, ActionButton } from './FormShell';
import { saveCategory, deleteCategory } from '@/lib/admin/actions';
import { resolveMediaUrl } from '@/lib/admin/media';
import { Badge } from './AdminUI';
import { slugify } from '@/lib/format';

function CategoryFields({ category }: { category: Category | null }) {
  const [title, setTitle] = useState(category?.title ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [touched, setTouched] = useState(Boolean(category));

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className="field-label">Naziv *</label>
        <input
          name="title" required className="field" value={title}
          onChange={(e) => { setTitle(e.target.value); if (!touched) setSlug(slugify(e.target.value)); }}
        />
      </div>
      <div>
        <label className="field-label">Slug *</label>
        <input
          name="slug" required className="field" value={slug}
          onChange={(e) => { setTouched(true); setSlug(slugify(e.target.value)); }}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Opis</label>
        <textarea name="description" rows={3} className="field resize-y" defaultValue={category?.description ?? ''} />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Naslovna fotografija</label>
        <input
          name="cover_image" className="field"
          placeholder="/assets/heng/... ili putanja iz Medija"
          defaultValue={category?.cover_image ?? ''}
        />
      </div>
      <div>
        <label className="field-label">Redosled</label>
        <input name="sort_order" type="number" className="field" defaultValue={category?.sort_order ?? 0} />
      </div>
      <div className="flex items-end">
        <label className="flex w-full cursor-pointer items-center gap-3 rounded-sm border border-ink/12 p-3">
          <input
            type="checkbox" name="is_published" defaultChecked={category?.is_published ?? true}
            className="accent-[color:var(--color-maroon)]"
          />
          <span className="font-body text-[14px]">Objavljena</span>
        </label>
      </div>
    </div>
  );
}

export function CategoriesPanel({ categories, counts }: {
  categories: Category[]; counts: Record<string, number>;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button onClick={() => { setAdding((v) => !v); setEditing(null); }} className="btn btn-primary">
          {adding ? 'Otkaži' : 'Nova kategorija'}
        </button>
      </div>

      {adding && (
        <div className="mb-8 rounded-sm border border-dashed border-gold/50 bg-white/60 p-6">
          <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>Nova kategorija</h2>
          <FormShell action={(fd) => saveCategory(null, fd)} submitLabel="Kreiraj kategoriju">
            <CategoryFields category={null} />
          </FormShell>
        </div>
      )}

      {categories.length === 0 && !adding ? (
        <p className="rounded-sm border border-dashed border-ink/18 px-6 py-16 text-center font-body text-[14px] text-ink/50">
          Još nema kategorija. Bez njih se svi proizvodi prikazuju u jednoj listi.
        </p>
      ) : (
        <ul className="space-y-3">
          {categories.map((c) => {
            const count = counts[c.id] ?? 0;
            return (
              <li key={c.id} className="rounded-sm border border-ink/12 bg-white/60">
                <div className="flex flex-wrap items-center gap-4 p-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-ivory">
                    {c.cover_image && (
                      <Image src={resolveMediaUrl(c.cover_image)} alt="" fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-[15px]">{c.title}</p>
                    <p className="truncate font-body text-[12px] text-ink/45">
                      /kolekcija/{c.slug} · {count} {count === 1 ? 'proizvod' : 'proizvoda'}
                    </p>
                  </div>
                  {c.is_published ? <Badge tone="neutral">Objavljena</Badge> : <Badge tone="muted">Skrivena</Badge>}
                  <div className="flex gap-4">
                    <button
                      onClick={() => { setEditing(editing === c.id ? null : c.id); setAdding(false); }}
                      className="link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/55"
                    >
                      {editing === c.id ? 'Zatvori' : 'Uredi'}
                    </button>
                    <ActionButton
                      action={() => deleteCategory(c.id)}
                      label="Obriši" tone="link" pendingLabel="Brisanje…"
                      confirm={
                        count > 0
                          ? `Kategorija „${c.title}” sadrži ${count} proizvod(a) i ne može biti obrisana dok se ne premeste. Nastaviti?`
                          : `Obrisati kategoriju „${c.title}”?`
                      }
                    />
                  </div>
                </div>

                {editing === c.id && (
                  <div className="border-t border-ink/10 p-5">
                    <FormShell action={(fd) => saveCategory(c.id, fd)}>
                      <CategoryFields category={c} />
                    </FormShell>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
