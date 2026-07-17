import Link from 'next/link';

export function NoAccess() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: 'var(--color-ivory-2)' }}>
      <div className="max-w-md text-center">
        <p className="heng-eyebrow mb-4" style={{ color: 'var(--color-gold)' }}>PRISTUP ODBIJEN</p>
        <h1 className="font-display text-[26px]" style={{ fontWeight: 600 }}>
          Nalog nema administratorska prava.
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-ink/62">
          Prijavljeni ste, ali profilu nije dodeljena uloga <code>admin</code>. Uputstvo za dodelu
          uloge nalazi se u README dokumentu.
        </p>
        <Link href="/" className="btn btn-outline mt-8">Nazad na sajt</Link>
      </div>
    </div>
  );
}
