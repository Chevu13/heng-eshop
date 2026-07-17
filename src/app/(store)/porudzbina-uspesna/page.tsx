import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { getSettings } from '@/lib/data/repository';

export const metadata: Metadata = {
  title: 'Porudžbina primljena',
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: { searchParams: { ref?: string } }) {
  const settings = await getSettings();
  const reference = searchParams.ref;

  return (
    <section
      className="flex min-h-[70svh] items-center py-24"
      style={{ background: 'var(--color-maroon)' }}
    >
      <div className="heng-container text-center">
        <Reveal>
          <p className="heng-eyebrow mb-6" style={{ color: 'var(--color-gold)' }}>
            PORUDŽBINA PRIMLJENA
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1
            className="mx-auto max-w-[18ch] font-display text-[clamp(2rem,5vw,2.9rem)] leading-[1.1] text-ivory"
            style={{ fontWeight: 700 }}
          >
            Hvala. Javljamo se uskoro.
          </h1>
        </Reveal>

        {reference && (
          <Reveal delay={0.12}>
            <div className="mx-auto mt-10 inline-block border border-ivory/20 px-8 py-5">
              <p className="heng-eyebrow mb-2 text-ivory/50">Broj porudžbine</p>
              <p className="font-display text-[24px] tabular-nums text-ivory" style={{ fontWeight: 600 }}>
                {reference}
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.18}>
          <p className="mx-auto mt-8 max-w-[52ch] font-body text-[15px] leading-[1.7] text-ivory/70">
            Porudžbina je evidentirana. Kontaktiramo vas radi potvrde detalja, iznosa i termina
            isporuke{settings.contact_email ? ' — ili nas možete kontaktirati direktno.' : '.'}
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/kolekcija" className="btn btn-outline-light">Nastavi razgledanje</Link>
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="btn btn-outline-light">
                {settings.contact_email}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
