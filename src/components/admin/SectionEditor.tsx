'use client';

import { useState } from 'react';
import type { HomepageSection } from '@/types';
import { FormShell } from './FormShell';
import { saveSection } from '@/lib/admin/actions';
import { Badge } from './AdminUI';

/** Opis polja po sekciji — pomaže administratoru da zna šta sme da menja. */
const HINTS: Record<string, string> = {
  announcement: 'text — tekst trake · href, linkLabel — opcioni link.',
  hero: 'eyebrow, heading, body · primaryLabel/primaryHref, secondaryLabel/secondaryHref · mediaUrl, mediaAlt · videoUrl, videoPoster (kada postoji video).',
  statement: 'heading, body, note · mediaUrl, mediaAlt.',
  featured: 'eyebrow, heading, body · productSlugs — niz slugova redosledom prikaza.',
  finishes: 'eyebrow, heading, body · productSlug — model na kom se prikazuju obrade.',
  material: 'eyebrow, heading, body · points — niz {title, text} · mediaUrl, mediaAlt.',
  gallery: 'eyebrow, heading · items — niz {url, caption, alt}.',
  dimensions: 'eyebrow, heading, body — mere se čitaju sa proizvoda.',
  projects: 'eyebrow, heading, body · audience — niz oznaka · ctaLabel, ctaHref · mediaUrl, mediaAlt.',
  instagram: 'eyebrow, heading, ctaLabel, href · items — niz putanja do fotografija.',
  final_cta: 'heading, body · primaryLabel/primaryHref, secondaryLabel/secondaryHref.',
};

export function SectionEditor({ section, label }: { section: HomepageSection; label: string }) {
  const [open, setOpen] = useState(false);

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
              <div className="sm:col-span-2">
                <label htmlFor={`content-${section.id}`} className="field-label">Sadržaj (JSON)</label>
                <textarea
                  id={`content-${section.id}`} name="content" rows={16} spellCheck={false}
                  className="field resize-y font-mono text-[12px] leading-relaxed"
                  defaultValue={JSON.stringify(section.content, null, 2)}
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
