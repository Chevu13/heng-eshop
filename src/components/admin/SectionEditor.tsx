'use client';

import { useState } from 'react';
import type { HomepageSection } from '@/types';
import { FormShell } from './FormShell';
import { saveSection } from '@/lib/admin/actions';
import { Badge } from './AdminUI';
import { ImagePicker } from './ImagePicker';

/** Opis polja po sekciji — pomaže administratoru da zna šta sme da menja. */
const HINTS: Record<string, string> = {
  hero: 'heading, body · primaryLabel/primaryHref · mediaUrl — SLIKA 2400 × 1250 px (široka; sredinu pokriva okvir sa tekstom, motiv neka bude levo i desno) · mediaPosition (kadar, npr. „center 60%”) · mediaUrlMobile — opciono, SLIKA ZA TELEFON 1200 × 1400 px · mediaAlt · videoUrl, videoPoster.',
  categories: 'heading · items — niz {title, href, mediaUrl, mediaAlt, mediaPosition}. SLIKE 1600 × 1600 px (kvadrat). href npr. /kolekcija/kamene-rucke.',
  why: 'heading · items — niz {icon, title, text}; icon: help, shield, ruler ili truck. Bez slike.',
  story: 'heading, body · ctaLabel, ctaHref. Bez slike.',
  material: 'heading, body · mediaUrl — SLIKA 1800 × 1350 px (4:3, motiv na sredini) · mediaAlt · ctaLabel, ctaHref.',
  handles: 'ista polja kao blok „Držači”: SLIKA 1800 × 1350 px (4:3, motiv na sredini).',
  bespoke: 'ista polja kao blok „Držači”: SLIKA 1800 × 1350 px (4:3, motiv na sredini).',
  inspace_banner: 'heading (naslov), body (tekst) · mediaUrl — SLIKA 1600 × 1200 px (4:3, motiv na sredini) · mediaAlt (opis slike).',
};

type Slot = { path: (string | number)[]; label: string; hint: string };

/** Mesta za slike po sekciji. Slika za telefon postoji samo gde se razmera razlikuje (hero). */
function slotsFor(key: string, content: Record<string, unknown>): Slot[] {
  const block = '1800 × 1350 px (4:3), motiv na sredini.';
  switch (key) {
    case 'hero': return [
      { path: ['mediaUrl'], label: 'Slika — računar', hint: '2400 × 1250 px. Sredinu pokriva okvir sa tekstom, glavni motiv neka bude levo i desno.' },
      { path: ['mediaUrlMobile'], label: 'Slika — telefon (opciono)', hint: '1200 × 1400 px. Bez nje telefon prikazuje sliku za računar, isečenu.' },
    ];
    case 'categories': return ((content.items as { title?: string }[] | undefined) ?? []).map((it, i) => (
      { path: ['items', i, 'mediaUrl'], label: `Kartica: ${it.title ?? i + 1}`, hint: '1600 × 1600 px (kvadrat).' }
    ));
    case 'material': case 'handles': case 'bespoke':
      return [{ path: ['mediaUrl'], label: 'Slika', hint: block }];
    case 'inspace_banner':
      return [{ path: ['mediaUrl'], label: 'Slika banera', hint: '1600 × 1200 px (4:3), motiv na sredini.' }];
    default: return [];
  }
}

function getAt(obj: unknown, path: (string | number)[]): string {
  const v = path.reduce<unknown>((o, k) => (o as Record<string | number, unknown> | undefined)?.[k], obj);
  return typeof v === 'string' ? v : '';
}

function setAt(obj: Record<string, unknown>, path: (string | number)[], value: string) {
  const copy = structuredClone(obj);
  let cur = copy as Record<string | number, unknown>;
  path.slice(0, -1).forEach((k) => { cur = cur[k] as Record<string | number, unknown>; });
  const last = path[path.length - 1];
  if (value) cur[last] = value; else delete cur[last];
  return copy;
}

export function SectionEditor({ section, label }: { section: HomepageSection; label: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => JSON.stringify(section.content, null, 2));
  let parsed: Record<string, unknown> | null = null;
  try { parsed = JSON.parse(text); } catch { parsed = null; }
  const slots = parsed ? slotsFor(section.key, parsed) : [];

  return (
    <li className="rounded-sm border border-ink/12 bg-white/60">
      <div className="flex flex-wrap items-center gap-4 p-5">
        <span className="font-display text-[13px] tabular-nums" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
          {String(section.sort_order).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-body text-[15px]">{label}</p>
          <p className="font-body text-[12px] text-ink/40">key: {section.key}</p>
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
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Interni naziv</label>
                <input name="title" className="field" defaultValue={section.title ?? ''} />
              </div>
              <div>
                <label className="field-label">Redosled</label>
                <input name="sort_order" type="number" className="field" defaultValue={section.sort_order} />
              </div>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-ink/12 p-4">
                  <input
                    type="checkbox" name="is_visible" defaultChecked={section.is_visible}
                    className="accent-[color:var(--color-maroon)]"
                  />
                  <span className="font-body text-[14px]">Prikazuj sekciju na početnoj strani</span>
                </label>
              </div>
              {slots.map((slot) => (
                <div key={slot.path.join('.')} className="sm:col-span-2">
                  <ImagePicker
                    label={slot.label} hint={slot.hint}
                    value={getAt(parsed, slot.path)}
                    onChange={(url) => parsed && setText(JSON.stringify(setAt(parsed, slot.path, url), null, 2))}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label htmlFor={`content-${section.id}`} className="field-label">Tekstovi (JSON)</label>
                <textarea
                  id={`content-${section.id}`} name="content" rows={16} spellCheck={false}
                  className="field resize-y font-mono text-[12px] leading-relaxed"
                  value={text} onChange={(e) => setText(e.target.value)}
                />
                <p className="mt-2 font-body text-[12px] leading-relaxed text-ink/50">
                  Polja: {HINTS[section.key] ?? 'proizvoljna.'}
                </p>
              </div>
            </div>
          </FormShell>
        </div>
      )}
    </li>
  );
}
