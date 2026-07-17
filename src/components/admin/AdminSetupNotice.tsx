import Link from 'next/link';

/** Prikazuje se kada Supabase kredencijali nisu postavljeni. */
export function AdminSetupNotice() {
  const steps = [
    'Napravite projekat na supabase.com i kopirajte Project URL, anon i service_role ključ.',
    'Popunite .env.local prema .env.example (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY).',
    'Pokrenite migracije iz supabase/migrations redom: 0001, 0002, 0003.',
    'Pokrenite `npm run seed` da biste uneli početni katalog i sadržaj početne strane.',
    'Registrujte nalog na /admin/prijava, pa mu dodelite ulogu admin (uputstvo u README).',
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="heng-eyebrow mb-4" style={{ color: 'var(--color-gold)' }}>ADMIN PANEL</p>
      <h1 className="font-display text-[30px]" style={{ fontWeight: 700 }}>
        Baza još nije povezana.
      </h1>
      <p className="mt-4 font-body text-[15px] leading-relaxed text-ink/65">
        Prodavnica trenutno radi u demonstracionom režimu — katalog se čita iz lokalnog seed
        sadržaja, a izmene i porudžbine nisu moguće dok se ne poveže Supabase.
      </p>

      <div className="heng-rule my-10" />

      <ol className="space-y-5">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-5">
            <span className="font-display text-[13px] tabular-nums" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="font-body text-[15px] leading-relaxed text-ink/72">{s}</p>
          </li>
        ))}
      </ol>

      <div className="heng-rule my-10" />

      <Link href="/" className="btn btn-outline">Nazad na sajt</Link>
    </div>
  );
}
