'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Wordmark } from '@/components/ui/Wordmark';
import { TextField } from '@/components/forms/Field';

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    if (!supabase) { setError('Baza nije povezana.'); setBusy(false); return; }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(fd.get('email') ?? '').trim().toLowerCase(),
      password: String(fd.get('password') ?? ''),
    });

    if (authError) {
      setError(
        authError.message.includes('Invalid login')
          ? 'Pogrešna email adresa ili lozinka.'
          : 'Prijava nije uspela. Pokušajte ponovo.',
      );
      setBusy(false);
      return;
    }

    const next = params.get('nastavi');
    router.push(next && next.startsWith('/admin') ? next : '/admin');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16" style={{ background: 'var(--color-maroon-deep)' }}>
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <Wordmark className="text-[32px]" tone="ivory" />
          <p className="heng-eyebrow mt-4" style={{ color: 'var(--color-gold)' }}>ADMIN PANEL</p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-sm p-8"
          style={{ background: 'var(--color-ivory-2)' }}
        >
          <h1 className="font-display text-[22px]" style={{ fontWeight: 600 }}>Prijava</h1>
          <div className="heng-rule my-6" />

          <div className="space-y-5">
            <TextField label="Email" name="email" type="email" required autoComplete="email" />
            <TextField label="Lozinka" name="password" type="password" required autoComplete="current-password" />
          </div>

          {error && (
            <p
              className="mt-5 rounded-sm p-3 font-body text-[13px]" role="alert"
              style={{ background: 'rgba(198,23,143,0.08)', color: 'var(--color-magenta)' }}
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full">
            {busy ? 'Prijava…' : 'Prijavi se'}
          </button>

          <div className="mt-6 flex items-center justify-between">
            <Link href="/admin/oporavak-lozinke" className="link-gold font-body text-[12px] text-ink/55">
              Zaboravljena lozinka?
            </Link>
            <Link href="/" className="link-gold font-body text-[12px] text-ink/55">
              Nazad na sajt
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--color-maroon-deep)' }} />}>
      <Form />
    </Suspense>
  );
}
