'use client';

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface Base { label: string; name: string; error?: string; hint?: string }

export function TextField({
  label, name, error, hint, ...props
}: Base & InputHTMLAttributes<HTMLInputElement>) {
  const errId = `${name}-greska`;
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}{props.required && <span aria-hidden="true" style={{ color: 'var(--color-gold)' }}> *</span>}
      </label>
      <input
        id={name} name={name}
        className="field"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errId : hint ? `${name}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 font-body text-[12px] text-ink/45">{hint}</p>
      )}
      {error && <p id={errId} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export function TextAreaField({
  label, name, error, hint, ...props
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const errId = `${name}-greska`;
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}{props.required && <span aria-hidden="true" style={{ color: 'var(--color-gold)' }}> *</span>}
      </label>
      <textarea
        id={name} name={name} rows={props.rows ?? 5}
        className="field resize-y"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errId : hint ? `${name}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 font-body text-[12px] text-ink/45">{hint}</p>
      )}
      {error && <p id={errId} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

/** Skriveno polje protiv botova — nikada ga ne vidi korisnik. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
      <label htmlFor="website">Ne popunjavati</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
