'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[app]', error); }, [error]);

  return (
    <section className="flex min-h-[74svh] items-center py-24" style={{ background: 'var(--color-maroon)' }}>
      <div className="heng-container text-center">
        <p className="heng-eyebrow mb-6" style={{ color: 'var(--color-gold)' }}>GREŠKA</p>
        <h1
          className="mx-auto max-w-[20ch] font-display text-[clamp(1.9rem,5vw,2.6rem)] leading-[1.1] text-ivory"
          style={{ fontWeight: 700 }}
        >
          Došlo je do neočekivane greške.
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] font-body text-[15px] leading-relaxed text-ivory/68">
          Pokušajte ponovo. Ako se greška ponovi, javite nam se i rešavamo je.
        </p>
        {error.digest && (
          <p className="mt-4 font-body text-[12px] text-ivory/55">Kod greške: {error.digest}</p>
        )}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button onClick={reset} className="btn btn-outline-light">Pokušaj ponovo</button>
          <Link href="/" className="btn btn-outline-light">Početna strana</Link>
        </div>
      </div>
    </section>
  );
}
