'use client';

import { useRef, useState } from 'react';
import { resolveMediaUrl } from '@/lib/admin/media';
import { uploadMediaFile } from '@/lib/admin/upload';

/**
 * Mesto za sliku: prevucite fajl sa računara ili kliknite i izaberite ga.
 * Slika se odmah otprema i prikazuje; adresa ide u skriveno polje `name`,
 * pa radi u svakoj postojećoj formi. Postojeća vrednost se samo prikazuje.
 */
export function ImagePicker({
  name, value, defaultValue = '', onChange, label, hint, accept = 'image/*,.jpg,.jpeg,.jfif',
}: {
  name?: string; value?: string; defaultValue?: string;
  onChange?: (url: string) => void; label?: string; hint?: string; accept?: string;
}) {
  const [own, setOwn] = useState(defaultValue);
  const url = value ?? own;
  const set = (v: string) => { setOwn(v); onChange?.(v); };

  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try { set(await uploadMediaFile(file)); } catch (e) { setError((e as Error).message); }
    setBusy(false);
  }

  const isVideo = /\.(mp4|webm)(\?|$)/i.test(url);

  return (
    <div>
      {label && <span className="field-label">{label}</span>}
      {name && <input type="hidden" name={name} value={url} />}

      <div
        role="button" tabIndex={0}
        onClick={() => !busy && fileRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (!busy) void upload(e.dataTransfer.files); }}
        className="flex cursor-pointer items-center gap-4 rounded-sm border-2 border-dashed p-3 transition-colors"
        style={{
          borderColor: dragging ? 'var(--color-gold)' : 'rgba(28,20,22,0.2)',
          background: dragging ? 'rgba(184,147,79,0.08)' : 'rgba(255,255,255,0.5)',
        }}
      >
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-ink/5">
          {url && !isVideo ? (
            // Obična <img>: postojeća vrednost može biti bilo koja adresa.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveMediaUrl(url)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-body text-[12px] text-ink/40">{isVideo ? 'Video' : '+'}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-body text-[14px] text-ink/75">
            {busy ? 'Otpremanje…' : url ? 'Prevucite novu sliku da zamenite ovu, ili kliknite.' : 'Prevucite sliku ovde ili kliknite da je izaberete.'}
          </p>
          {url && !busy && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); set(''); }}
              className="mt-2 font-body text-[12px] underline underline-offset-4"
              style={{ color: 'var(--color-magenta)' }}
            >
              Ukloni sliku
            </button>
          )}
          {error && <p role="alert" className="mt-2 font-body text-[12px]" style={{ color: 'var(--color-magenta)' }}>{error}</p>}
        </div>
        <input
          ref={fileRef} type="file" className="sr-only" accept={accept}
          onChange={(e) => { void upload(e.target.files); e.target.value = ''; }}
        />
      </div>
      {hint && <p className="mt-1.5 font-body text-[12px] text-ink/45">{hint}</p>}
    </div>
  );
}
