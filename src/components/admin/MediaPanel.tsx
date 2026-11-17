'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useTransition } from 'react';
import type { ProductMedia, ProductVariant } from '@/types';
import { FormShell, ActionButton } from './FormShell';
import { attachMediaMany, detachMedia, reorderMedia, updateMedia } from '@/lib/admin/actions';
import { resolveMediaUrl } from '@/lib/admin/media';
import { uploadMediaFile } from '@/lib/admin/upload';

// Isto kao na sajtu (repository.sortProduct): naslovna prva, pa po redosledu.
const sortMedia = (m: ProductMedia[]) =>
  [...m].sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order);

const ACCEPT = 'image/*,video/mp4,video/webm,.jpg,.jpeg,.jfif,.mp4,.webm';

export function MediaPanel({ productId, productName, media, variants }: {
  productId: string; productName: string; media: ProductMedia[]; variants: ProductVariant[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [order, setOrder] = useState(() => sortMedia(media));
  useEffect(() => setOrder(sortMedia(media)), [media]);

  // ---- otpremanje više fajlova odjednom ----
  const [variantId, setVariantId] = useState('');
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(list: FileList | null) {
    const files = Array.from(list ?? []);
    if (!files.length || progress) return;
    setMsg(null);
    const urls: string[] = [];
    const errors: string[] = [];
    for (const [i, f] of files.entries()) {
      setProgress(`Otpremanje ${i + 1} od ${files.length}…`);
      try { urls.push(await uploadMediaFile(f)); } catch (e) { errors.push((e as Error).message); }
    }
    if (urls.length) {
      setProgress('Čuvanje…');
      const finish = variants.find((v) => v.id === variantId)?.finish_name;
      const r = await attachMediaMany(productId, urls, variantId || null, finish ? `${productName} — ${finish}` : productName);
      if (!r.ok) errors.unshift(r.message);
      else setMsg({ ok: true, text: r.message });
    }
    if (errors.length) setMsg({ ok: false, text: errors.join(' ') });
    setProgress(null);
  }

  // ---- redosled ----
  const [saving, startSave] = useTransition();
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setOrder(next);
    startSave(async () => {
      const r = await reorderMedia(productId, next.map((m) => m.id));
      if (!r.ok) setMsg({ ok: false, text: r.message });
    });
  }

  const finishName = (id: string | null) => variants.find((v) => v.id === id)?.finish_name;

  return (
    <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
      <div className="mb-5">
        <h2 className="font-display text-[18px]" style={{ fontWeight: 600 }}>Galerija</h2>
        <p className="mt-1 font-body text-[13px] text-ink/55">
          Prevucite jednu ili više fotografija odjednom. Redosled menjate strelicama ili prevlačenjem
          kartica; prva fotografija je naslovna i prikazuje se na kartici u katalogu.
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <div className="max-w-sm">
          <label className="field-label">Nove fotografije vezati za obradu</label>
          <select className="field cursor-pointer" value={variantId} onChange={(e) => setVariantId(e.target.value)}>
            <option value="">Bez veze sa obradom (prikazuju se uvek)</option>
            {variants.map((v) => <option key={v.id} value={v.id}>{v.finish_name}</option>)}
          </select>
        </div>
        <div
          role="button" tabIndex={0}
          onClick={() => !progress && fileRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click(); } }}
          onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDragging(true); } }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); void upload(e.dataTransfer.files); }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed px-6 py-8 text-center transition-colors"
          style={{
            borderColor: dragging ? 'var(--color-gold)' : 'rgba(28,20,22,0.2)',
            background: dragging ? 'rgba(184,147,79,0.08)' : 'rgba(255,255,255,0.5)',
          }}
        >
          <p className="font-body text-[15px] text-ink/75">
            {progress ?? 'Prevucite fotografije ovde ili kliknite da ih izaberete'}
          </p>
          <p className="mt-1.5 font-body text-[12px] text-ink/45">
            Može više odjednom. 1600 × 2000 px (4:5, uspravna), proizvod na sredini. Video: MP4 ili WEBM.
          </p>
          <input
            ref={fileRef} type="file" multiple className="sr-only" accept={ACCEPT}
            onChange={(e) => { void upload(e.target.files); e.target.value = ''; }}
          />
        </div>
        {msg && (
          <p role={msg.ok ? 'status' : 'alert'} className="font-body text-[13px]"
             style={{ color: msg.ok ? '#4B262D' : 'var(--color-magenta)' }}>
            {msg.text}
          </p>
        )}
      </div>

      {order.length === 0 ? (
        <p className="rounded-sm border border-dashed border-ink/18 px-6 py-10 text-center font-body text-[14px] text-ink/50">
          Galerija je prazna. Proizvod bez fotografije prikazuje se sa oznakom „Fotografija u pripremi”.
        </p>
      ) : (
        <>
          {saving && <p className="mb-3 font-body text-[12px] text-ink/45">Čuvanje redosleda…</p>}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {order.map((m, i) => (
              <li
                key={m.id}
                draggable={editing !== m.id}
                onDragStart={(e) => { setDragIdx(i); e.dataTransfer.effectAllowed = 'move'; }}
                onDragOver={(e) => { if (dragIdx !== null) e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); if (dragIdx !== null) move(dragIdx, i); setDragIdx(null); }}
                onDragEnd={() => setDragIdx(null)}
                className="rounded-sm border bg-white/60 transition-opacity"
                style={{ borderColor: 'rgba(28,20,22,0.12)', opacity: dragIdx === i ? 0.4 : 1, cursor: 'grab' }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-sm bg-ivory">
                  {m.kind === 'video' ? (
                    <video
                      src={resolveMediaUrl(m.url)}
                      poster={m.poster_url ? resolveMediaUrl(m.poster_url) : undefined}
                      className="h-full w-full object-cover" muted playsInline preload="metadata"
                    />
                  ) : (
                    <Image src={resolveMediaUrl(m.url)} alt={m.alt ?? ''} fill sizes="240px" className="pointer-events-none object-cover" />
                  )}
                  <span
                    className="absolute left-2 top-2 rounded-sm px-2 py-1 font-body text-[11px] tabular-nums"
                    style={i === 0
                      ? { background: 'var(--color-gold)', color: 'var(--color-ink)' }
                      : { background: 'rgba(255,255,255,0.9)', color: 'var(--color-ink)' }}
                  >
                    {i === 0 ? '1 · Naslovna' : i + 1}
                  </span>
                </div>

                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <button
                      type="button" onClick={() => move(i, i - 1)} disabled={i === 0}
                      aria-label="Pomeri levo" className="btn btn-outline !px-3 !py-1.5 disabled:opacity-30"
                    >←</button>
                    <button
                      type="button" onClick={() => move(i, i + 1)} disabled={i === order.length - 1}
                      aria-label="Pomeri desno" className="btn btn-outline !px-3 !py-1.5 disabled:opacity-30"
                    >→</button>
                    {i !== 0 && (
                      <button
                        type="button" onClick={() => move(i, 0)}
                        className="link-gold ml-auto font-body text-[11px] uppercase tracking-eyebrow text-ink/55"
                      >Postavi kao naslovnu</button>
                    )}
                  </div>

                  <p className="line-clamp-2 font-body text-[12px] text-ink/60">
                    {m.alt || <span className="text-magenta">Nedostaje alt tekst</span>}
                  </p>
                  <p className="mt-1 font-body text-[11px] text-ink/40">
                    {finishName(m.variant_id) ? `Obrada: ${finishName(m.variant_id)}` : 'Bez veze sa obradom'}
                  </p>

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
                      confirm="Ukloniti fotografiju sa proizvoda?"
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
                            <label className="field-label">Vezano za obradu</label>
                            <select name="variant_id" className="field cursor-pointer" defaultValue={m.variant_id ?? ''}>
                              <option value="">Bez veze sa obradom</option>
                              {variants.map((v) => <option key={v.id} value={v.id}>{v.finish_name}</option>)}
                            </select>
                          </div>
                        </div>
                      </FormShell>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
