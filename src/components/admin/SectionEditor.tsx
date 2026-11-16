'use client';

import { useState } from 'react';
import type { HomepageSection } from '@/types';
import { FormShell } from './FormShell';
import { saveSection } from '@/lib/admin/actions';
import { Badge } from './AdminUI';
import { ImagePicker } from './ImagePicker';

/*
 * Sekcija se uređuje kroz obična polja. Sadržaj se i dalje čuva kao jedan
 * objekat (skriveno polje `content`), pa server i baza ostaju isti; polja
 * koja forma ne prikazuje (stari ključevi) čuvaju se netaknuta.
 */

type Field = {
  k: string; label: string;
  type?: 'text' | 'textarea' | 'image' | 'icon';
  hint?: string; placeholder?: string;
};
type Schema = { fields: Field[]; list?: { label: string; item: string; fields: Field[] } };

const LINK_HINT = 'Adresa na sajtu, npr. /kolekcija ili /kolekcija/kamene-rucke.';
const BLOCK: Schema = {
  fields: [
    { k: 'mediaUrl', label: 'Slika', type: 'image', hint: '1800 × 1350 px (4:3), motiv na sredini.' },
    { k: 'mediaAlt', label: 'Opis slike', hint: 'Kratko, za Google i čitače ekrana.' },
    { k: 'heading', label: 'Naslov' },
    { k: 'body', label: 'Tekst', type: 'textarea' },
    { k: 'ctaLabel', label: 'Tekst dugmeta' },
    { k: 'ctaHref', label: 'Link dugmeta', hint: LINK_HINT },
  ],
};

const SCHEMAS: Record<string, Schema> = {
  hero: {
    fields: [
      { k: 'mediaUrl', label: 'Slika — računar', type: 'image', hint: '2400 × 1250 px. Sredinu pokriva okvir sa tekstom, glavni motiv neka bude levo i desno.' },
      { k: 'mediaUrlMobile', label: 'Slika — telefon (opciono)', type: 'image', hint: '1200 × 1400 px. Bez nje telefon prikazuje sliku za računar, isečenu.' },
      { k: 'mediaAlt', label: 'Opis slike', hint: 'Kratko, za Google i čitače ekrana.' },
      { k: 'mediaPosition', label: 'Kadar slike na računaru (opciono)', placeholder: 'center 50%', hint: 'Pomera sliku gore-dole: manji broj prikazuje viši deo slike, veći niži. Npr. center 60%.' },
      { k: 'heading', label: 'Naslov' },
      { k: 'body', label: 'Tekst', type: 'textarea' },
      { k: 'primaryLabel', label: 'Tekst dugmeta' },
      { k: 'primaryHref', label: 'Link dugmeta', hint: LINK_HINT },
    ],
  },
  categories: {
    fields: [{ k: 'heading', label: 'Naslov sekcije' }],
    list: {
      label: 'Kartice', item: 'Kartica',
      fields: [
        { k: 'mediaUrl', label: 'Slika', type: 'image', hint: '1600 × 1600 px (kvadrat).' },
        { k: 'title', label: 'Naziv' },
        { k: 'href', label: 'Link', hint: LINK_HINT },
        { k: 'mediaAlt', label: 'Opis slike' },
      ],
    },
  },
  why: {
    fields: [{ k: 'heading', label: 'Naslov sekcije' }],
    list: {
      label: 'Stavke', item: 'Stavka',
      fields: [
        { k: 'icon', label: 'Ikonica', type: 'icon' },
        { k: 'title', label: 'Naslov' },
        { k: 'text', label: 'Tekst', type: 'textarea' },
      ],
    },
  },
  story: {
    fields: [
      { k: 'heading', label: 'Naslov' },
      { k: 'body', label: 'Tekst', type: 'textarea' },
      { k: 'ctaLabel', label: 'Tekst dugmeta' },
      { k: 'ctaHref', label: 'Link dugmeta', hint: LINK_HINT },
    ],
  },
  material: BLOCK,
  handles: BLOCK,
  bespoke: BLOCK,
  inspace_banner: {
    fields: [
      { k: 'mediaUrl', label: 'Slika banera', type: 'image', hint: '1600 × 1200 px (4:3), motiv na sredini.' },
      { k: 'mediaAlt', label: 'Opis slike' },
      { k: 'heading', label: 'Naslov' },
      { k: 'body', label: 'Tekst', type: 'textarea' },
    ],
  },
};

const ICONS = [
  ['help', 'Slušalice (pomoć)'], ['shield', 'Štit (kvalitet)'], ['ruler', 'Lenjir (po meri)'], ['truck', 'Kamion (isporuka)'],
];

type Obj = Record<string, unknown>;

function Input({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  if (field.type === 'image') {
    return <ImagePicker label={field.label} hint={field.hint} value={value} onChange={onChange} />;
  }
  return (
    <div>
      <label className="field-label">{field.label}</label>
      {field.type === 'textarea' ? (
        <textarea rows={3} className="field resize-y" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === 'icon' ? (
        <select className="field cursor-pointer" value={value} onChange={(e) => onChange(e.target.value)}>
          {ICONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      ) : (
        <input className="field" value={value} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.hint && <p className="mt-1.5 font-body text-[12px] text-ink/45">{field.hint}</p>}
    </div>
  );
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

export function SectionEditor({ section, label }: { section: HomepageSection; label: string }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<Obj>(() => ({ ...(section.content as Obj) }));
  const schema = SCHEMAS[section.key];

  const setField = (k: string, v: string) => setContent((c) => ({ ...c, [k]: v }));
  const items = (Array.isArray(content.items) ? content.items : []) as Obj[];
  const setItems = (next: Obj[]) => setContent((c) => ({ ...c, items: next }));

  return (
    <li className="rounded-sm border border-ink/12 bg-white/60">
      <div className="flex flex-wrap items-center gap-4 p-5">
        <span className="font-display text-[13px] tabular-nums" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
          {String(section.sort_order).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-body text-[15px]">{label}</p>
        </div>
        {section.is_visible ? <Badge tone="neutral">Vidljiva</Badge> : <Badge tone="muted">Sakrivena</Badge>}
        <button
          onClick={() => setOpen((v) => !v)}
          className="link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/55"
          aria-expanded={open}
        >
          {open ? 'Zatvori' : 'Uredi'}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 p-5">
          <FormShell action={(fd) => saveSection(section.id, fd)}>
            <input type="hidden" name="content" value={JSON.stringify(content)} />
            <input type="hidden" name="title" value={section.title ?? ''} />
            <input type="hidden" name="sort_order" value={section.sort_order} />

            <div className="space-y-5">
              {schema?.fields.map((f) => (
                <Input key={f.k} field={f} value={str(content[f.k])} onChange={(v) => setField(f.k, v)} />
              ))}

              {schema?.list && (
                <div>
                  <p className="field-label">{schema.list.label}</p>
                  <ul className="space-y-4">
                    {items.map((it, i) => (
                      <li key={i} className="space-y-4 rounded-sm border border-ink/12 bg-white/70 p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-body text-[13px] text-ink/60">{schema.list!.item} {i + 1}</span>
                          <button
                            type="button" onClick={() => setItems(items.filter((_, j) => j !== i))}
                            className="font-body text-[12px] underline underline-offset-4" style={{ color: 'var(--color-magenta)' }}
                          >
                            Ukloni
                          </button>
                        </div>
                        {schema.list!.fields.map((f) => (
                          <Input
                            key={f.k} field={f} value={str(it[f.k])}
                            onChange={(v) => setItems(items.map((x, j) => (j === i ? { ...x, [f.k]: v } : x)))}
                          />
                        ))}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setItems([...items, schema.list!.fields.some((f) => f.k === 'icon') ? { icon: 'help' } : {}])}
                    className="btn btn-outline mt-4"
                  >
                    + Dodaj: {schema.list.item.toLowerCase()}
                  </button>
                </div>
              )}

              {!schema && (
                <p className="font-body text-[13px] text-ink/55">Ova sekcija nema polja za uređivanje.</p>
              )}

              <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-ink/12 p-4">
                <input
                  type="checkbox" name="is_visible" defaultChecked={section.is_visible}
                  className="accent-[color:var(--color-maroon)]"
                />
                <span className="font-body text-[14px]">Prikazuj sekciju na sajtu</span>
              </label>
            </div>
          </FormShell>
        </div>
      )}
    </li>
  );
}
