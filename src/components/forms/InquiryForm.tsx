'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TextField, TextAreaField, Honeypot } from './Field';

const PROJECT_TYPES = [
  'Privatni enterijer', 'Kuhinja po meri', 'Restoran', 'Hotel',
  'Vinski bar', 'Vinarija', 'Maloprodajni prostor', 'Drugo',
];

/**
 * Projektni upit. Isti obrazac koristi i kontakt strana, u skraćenom režimu.
 */
export function InquiryForm({ compact = false, prefill }: { compact?: boolean; prefill?: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/upiti', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        if (data.field) setErrors({ [String(data.field)]: data.error });
        setFormError(data.error ?? 'Upit nije poslat.');
        setBusy(false);
        return;
      }
      setSent(true);
    } catch {
      setFormError('Veza sa serverom nije uspostavljena. Pokušajte ponovo.');
    }
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="border border-ink/12 p-10 text-center" role="status">
        <span aria-hidden="true" className="mx-auto mb-6 block h-px w-14" style={{ background: 'var(--color-gold)' }} />
        <h2 className="font-display text-[22px]" style={{ fontWeight: 600 }}>Upit je poslat.</h2>
        <p className="mx-auto mt-3 max-w-[46ch] font-body text-[15px] leading-relaxed text-ink/62">
          Hvala na poverenju. Javljamo se u najkraćem roku sa predlogom postavke i informacijama o ceni.
        </p>
        <Link href="/kolekcija" className="btn btn-outline mt-8">Pogledaj kolekciju</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate encType="multipart/form-data">
      <Honeypot />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Ime i prezime" name="full_name" required autoComplete="name" error={errors.full_name} />
        <TextField label="Kompanija" name="company" autoComplete="organization" error={errors.company} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
        <TextField label="Telefon" name="phone" type="tel" autoComplete="tel" error={errors.phone} />

        {!compact && (
          <>
            <div>
              <label htmlFor="project_type" className="field-label">Vrsta projekta</label>
              <select id="project_type" name="project_type" className="field cursor-pointer" defaultValue="">
                <option value="">Izaberite…</option>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <TextField label="Lokacija" name="location" placeholder="Grad ili adresa objekta" error={errors.location} />
          </>
        )}

        <div className="sm:col-span-2">
          <TextAreaField
            label="Kratak opis projekta" name="description" required rows={compact ? 5 : 6}
            hint="Vrsta prostora, približne mere zida ili niše, željeni broj flaša i čaša."
            error={errors.description}
          />
        </div>

        {!compact && (
          <>
            <TextField
              label="Željeni proizvodi" name="desired_products"
              defaultValue={prefill}
              placeholder="Model 01, Model 03…"
              error={errors.desired_products}
            />
            <TextField
              label="Planirani rok" name="deadline"
              placeholder="npr. septembar 2026."
              error={errors.deadline}
            />

            <div className="sm:col-span-2">
              <label htmlFor="attachment" className="field-label">Prilog</label>
              <label
                htmlFor="attachment"
                className="flex cursor-pointer items-center justify-between gap-4 rounded-sm border border-dashed px-4 py-4 transition-colors duration-200 hover:border-gold"
                style={{ borderColor: errors.attachment ? 'var(--color-magenta)' : 'rgba(28,20,22,0.2)' }}
              >
                <span className="font-body text-[14px] text-ink/60">
                  {fileName ?? 'Izaberite fajl — crtež, foto ili PDF'}
                </span>
                <span className="shrink-0 font-body text-[12px] uppercase tracking-eyebrow text-gold">
                  Dodaj
                </span>
              </label>
              <input
                id="attachment" name="attachment" type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="sr-only"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                aria-describedby="attachment-hint"
              />
              <p id="attachment-hint" className="mt-1.5 font-body text-[12px] text-ink/45">
                JPG, PNG, WEBP ili PDF, do 10 MB.
              </p>
              {errors.attachment && <p className="field-error" role="alert">{errors.attachment}</p>}
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox" name="consent" required
              className="mt-1 accent-[color:var(--color-maroon)]"
            />
            <span className="font-body text-[13px] leading-relaxed text-ink/62">
              Saglasan/na sam da HENG obradi navedene podatke radi odgovora na upit, u skladu sa{' '}
              <Link href="/politika-privatnosti" className="link-gold">politikom privatnosti</Link>.
            </span>
          </label>
          {errors.consent && <p className="field-error" role="alert">{errors.consent}</p>}
        </div>
      </div>

      {formError && (
        <p
          className="mt-6 rounded-sm p-3 font-body text-[13px]" role="alert"
          style={{ background: 'rgba(198,23,143,0.08)', color: 'var(--color-magenta)' }}
        >
          {formError}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary mt-8">
        {busy ? 'Slanje…' : compact ? 'Pošalji poruku' : 'Pošalji projektni upit'}
      </button>
    </form>
  );
}
