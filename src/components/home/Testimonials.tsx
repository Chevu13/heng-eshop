import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

// Privremeni utisci — zameniti stvarnim kada ih klijent pošalje.
const ITEMS = [
  { quote: 'Letva za čaše ispod gornjeg elementa potpuno je promenila izgled naše kuhinje. Montaža je bila jednostavna, a kvalitet se vidi na prvi pogled.', name: 'Marija P.', place: 'Beograd' },
  { quote: 'Kamene ručke su detalj o kome nas svaki gost pita. Svaka je zaista drugačija.', name: 'Nikola S.', place: 'Novi Sad' },
  { quote: 'Za vinski zid u restoranu tražili smo nešto svedeno i trajno. HENG je predložio raspored koji je savršeno legao u prostor.', name: 'Jelena M.', place: 'arhitekta, Niš' },
];

/**
 * UTISCI — na telefonu prevlačenje (scroll-snap) umesto tri kartice jedne ispod
 * druge; od 1024px tri kolone.
 */
export function Testimonials() {
  return (
    <section aria-label="Utisci" className="bg-ivory-2 py-20 lg:py-28">
      <div className="heng-container">
        <SectionHeading eyebrow="UTISCI" heading="Šta kažu naši kupci." />
      </div>
      <ul className="heng-container mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible">
        {ITEMS.map((t, i) => (
          <li key={t.name} className="w-[84%] shrink-0 snap-center sm:w-[60%] lg:w-auto">
            <Reveal delay={i * 0.08} className="h-full">
              <figure className="flex h-full flex-col border-t border-gold/60 bg-ivory px-7 pb-8 pt-7">
                <span aria-hidden="true" className="font-display text-[56px] leading-[0.6]" style={{ color: 'var(--color-gold)' }}>“</span>
                <blockquote className="mt-4 font-display text-[21px] leading-[1.45] text-ink/85" style={{ fontWeight: 400 }}>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto pt-8 font-body text-[11px] uppercase tracking-eyebrow text-ink/55">
                  {t.name} <span aria-hidden="true" className="mx-1.5 text-ink/25">·</span> {t.place}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
