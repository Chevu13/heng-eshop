import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center py-24" style={{ background: 'var(--color-maroon)' }}>
      <div className="heng-container text-center">
        <p className="heng-eyebrow mb-6" style={{ color: 'var(--color-gold)' }}>GREŠKA 404</p>
        <h1
          className="mx-auto max-w-[18ch] font-display text-[clamp(1.9rem,5vw,2.8rem)] leading-[1.1] text-ivory"
          style={{ fontWeight: 700 }}
        >
          Ova stranica nije pronađena.
        </h1>
        <Link href="/" className="btn btn-outline-light mt-10">Početna strana</Link>
      </div>
    </section>
  );
}
