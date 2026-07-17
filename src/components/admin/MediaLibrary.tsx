'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { uploadMedia, deleteMediaFile } from '@/lib/admin/actions';
import { publicMediaUrl } from '@/lib/admin/media';
import { ActionButton } from './FormShell';
import { Badge } from './AdminUI';

export interface MediaFile { path: string; name: string; size: number; type: string }
export interface LocalAsset { path: string; alt: string; group: string; original: string }

function kb(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

function CopyPath({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(path);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className="link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/55"
    >
      {copied ? 'Kopirano' : 'Kopiraj putanju'}
    </button>
  );
}

export function MediaLibrary({ files, error, local }: {
  files: MediaFile[]; error: string | null; local: LocalAsset[];
}) {
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'storage' | 'lokalni'>('storage');

  function upload(list: FileList | null) {
    if (!list?.length) return;
    const fd = new FormData();
    Array.from(list).forEach((f) => fd.append('files', f));
    start(async () => {
      const res = await uploadMedia(fd);
      setMessage({ ok: res.ok, text: res.message });
    });
  }

  return (
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
        className="rounded-sm border-2 border-dashed p-10 text-center transition-colors duration-200"
        style={{
          borderColor: dragging ? 'var(--color-gold)' : 'rgba(28,20,22,0.18)',
          background: dragging ? 'rgba(184,147,79,0.06)' : 'rgba(255,255,255,0.5)',
        }}
      >
        <p className="font-display text-[18px]" style={{ fontWeight: 600 }}>
          {pending ? 'Otpremanje u toku…' : 'Prevucite fajlove ovde'}
        </p>
        <p className="mx-auto mt-2 max-w-md font-body text-[13px] text-ink/55">
          JPG, PNG, WEBP, AVIF, MP4 ili WEBM — do 25 MB po fajlu.
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="btn btn-outline mt-6"
        >
          Izaberi fajlove
        </button>
        <input
          ref={inputRef} type="file" multiple className="sr-only"
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          onChange={(e) => upload(e.target.files)}
        />
        {message && (
          <p
            role="status"
            className="mt-5 font-body text-[13px]"
            style={{ color: message.ok ? 'var(--color-maroon)' : 'var(--color-magenta)' }}
          >
            {message.text}
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert" className="mt-6 rounded-sm p-4 font-body text-[13px]"
          style={{ background: 'rgba(198,23,143,0.07)', color: 'var(--color-magenta)' }}
        >
          {error}
        </p>
      )}

      <div className="mt-10 flex gap-6 border-b border-ink/12">
        {([
          { id: 'storage', label: `Otpremljeno (${files.length})` },
          { id: 'lokalni', label: `Brend materijal (${local.length})` },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'true' : undefined}
            className="-mb-px border-b-2 pb-3 font-body text-[13px] uppercase tracking-eyebrow transition-colors"
            style={{
              borderColor: tab === t.id ? 'var(--color-gold)' : 'transparent',
              color: tab === t.id ? 'var(--color-maroon)' : 'rgba(28,20,22,0.5)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'storage' ? (
        files.length === 0 ? (
          <p className="mt-8 rounded-sm border border-dashed border-ink/18 px-6 py-16 text-center font-body text-[14px] text-ink/50">
            Još nema otpremljenih fajlova. Fotografije isporučene uz projekat nalaze se u kartici
            „Brend materijal”.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {files.map((f) => (
              <li key={f.path} className="rounded-sm border border-ink/12 bg-white/60">
                <div className="relative aspect-square overflow-hidden rounded-t-sm bg-ivory">
                  {f.type.startsWith('video') ? (
                    <video src={publicMediaUrl(f.path)} className="h-full w-full object-cover" muted playsInline />
                  ) : (
                    <Image src={publicMediaUrl(f.path)} alt="" fill sizes="220px" className="object-cover" />
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate font-body text-[12px]" title={f.name}>{f.name}</p>
                  <p className="mt-0.5 font-body text-[11px] text-ink/40">{kb(f.size)}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <CopyPath path={f.path} />
                    <ActionButton
                      action={() => deleteMediaFile(f.path)}
                      label="Obriši" tone="link" pendingLabel="Brisanje…"
                      confirm={`Obrisati „${f.name}”? Proizvodi koji ga koriste ostaće bez te fotografije.`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {local.map((a) => (
            <li key={a.path} className="rounded-sm border border-ink/12 bg-white/60">
              <div className="relative aspect-square overflow-hidden rounded-t-sm bg-ivory">
                <Image src={a.path} alt="" fill sizes="220px" className="object-cover" />
              </div>
              <div className="p-3">
                <Badge tone="muted">{a.group}</Badge>
                <p className="mt-2 line-clamp-2 font-body text-[12px] text-ink/60">{a.alt}</p>
                <p className="mt-1 truncate font-body text-[10px] text-ink/35" title={a.original}>
                  original: {a.original}
                </p>
                <div className="mt-3">
                  <CopyPath path={a.path} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
