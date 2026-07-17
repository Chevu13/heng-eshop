import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      className="flex min-h-[74svh] items-center py-24"
      style={{ background: 'var(--color-maroon)' }}
    >
      <div className="heng-container text-center">
        <p className="heng-eyebrow mb-6" style={{ color: 'var(--color-gold)' }}>GREŠKA 404</p>
        <h1
          className="mx-auto max-w-[18ch] font-display text-[clamp(1.9rem,5vw,2.8rem)] leading-[1.1] text-ivory"
          style={{ fontWeight: 700 }}
        >
          Ova stranica nije pronađena.
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] font-body text-[15px] leading-relaxed text-ivory/68">
          Adresa je možda promenjena ili proizvod više nije objavljen.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/kolekcija" className="btn btn-outline-light">Pogledaj kolekciju</Link>
          <Link href="/" className="btn btn-outline-light">Početna strana</Link>
        </div>
      </div>
    </section>
  );
}
