'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Wordmark } from '@/components/ui/Wordmark';
import { TextField } from '@/components/forms/Field';

export function PasswordRecoveryForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    if (!supabase) { setError('Baza nije povezana.'); setBusy(false); return; }

    const { error: err } = await supabase.auth.resetPasswordForEmail(
      String(fd.get('email') ?? '').trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/admin/prijava` },
    );

    // Poruka je namerno ista i kad email ne postoji — bez otkrivanja naloga.
    if (err && !err.message.includes('not found')) {
      setError('Slanje nije uspelo. Pokušajte ponovo.');
      setBusy(false);
      return;
    }
    setSent(true);
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16" style={{ background: 'var(--color-maroon-deep)' }}>
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <Wordmark className="text-[32px]" tone="ivory" />
          <p className="heng-eyebrow mt-4" style={{ color: 'var(--color-gold)' }}>ADMIN PANEL</p>
        </div>

        <div className="rounded-sm p-8" style={{ background: 'var(--color-ivory-2)' }}>
          {sent ? (
            <div role="status">
              <h1 className="font-display text-[22px]" style={{ fontWeight: 600 }}>Proverite email</h1>
              <p className="mt-4 font-body text-[14px] leading-relaxed text-ink/65">
                Ako nalog sa unetom adresom postoji, poslali smo link za postavljanje nove lozinke.
              </p>
              <Link href="/admin/prijava" className="btn btn-outline mt-7 w-full">Nazad na prijavu</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <h1 className="font-display text-[22px]" style={{ fontWeight: 600 }}>Oporavak lozinke</h1>
              <p className="mt-3 font-body text-[13px] leading-relaxed text-ink/58">
                Unesite email naloga — šaljemo link za postavljanje nove lozinke.
              </p>
              <div className="heng-rule my-6" />
              <TextField label="Email" name="email" type="email" required autoComplete="email" />
              {error && (
                <p className="mt-4 font-body text-[13px]" role="alert" style={{ color: 'var(--color-magenta)' }}>
                  {error}
                </p>
              )}
              <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full">
                {busy ? 'Slanje…' : 'Pošalji link'}
              </button>
              <Link href="/admin/prijava" className="link-gold mt-6 block text-center font-body text-[12px] text-ink/55">
                Nazad na prijavu
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
