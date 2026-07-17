import type { Metadata } from 'next';
import Image from 'next/image';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { Reveal, ImageReveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import { getSection } from '@/lib/data/repository';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Projekti',
  description:
    'Saradnja sa arhitektama, dizajnerima i izvođačima na prilagođenim postavkama za privatne i komercijalne prostore.',
  alternates: { canonical: '/projekti' },
};

export default async function ProjectsPage({
  searchParams,
}: { searchParams: { proizvod?: string } }) {
  const section = await getSection('projects');
  const c = (section?.content ?? {}) as {
    heading?: string; body?: string; audience?: string[]; mediaUrl?: string; mediaAlt?: string;
  };

  const steps = [
    { title: 'Opis prostora', text: 'Šaljete mere zida ili niše, fotografiju i predstavu o količini flaša i čaša.' },
    { title: 'Predlog postavke', text: 'Predlažemo raspored, model i obradu koja se uklapa u postojeće materijale.' },
    { title: 'Ponuda', text: 'Dobijate ponudu sa količinama, obradom i rokom, bez obaveze.' },
    { title: 'Izrada i isporuka', text: 'Nakon potvrde ulazimo u izradu i dogovaramo isporuku.' },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Projekti', url: '/projekti' }])} />

      <section className="relative flex min-h-[62svh] items-end overflow-hidden" style={{ background: 'var(--color-maroon-deep)' }}>
        {c.mediaUrl && (
          <Image
            src={c.mediaUrl}
            alt={c.mediaAlt ?? ''}
            fill priority quality={80} sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(51,25,30,0.9) 0%, rgba(51,25,30,0.4) 55%, rgba(51,25,30,0.45) 100%)' }}
        />
        <div className="heng-container relative z-10 pb-14 pt-36">
          <p className="heng-eyebrow mb-5" style={{ color: 'var(--color-gold)' }}>PROJEKTI</p>
          <h1
            className="max-w-[16ch] font-display text-[clamp(2rem,5.4vw,3.1rem)] leading-[1.08] text-ivory"
            style={{ fontWeight: 700, letterSpacing: '-0.015em' }}
          >
            {c.heading ?? 'Za enterijere koji zahtevaju više.'}
          </h1>
          <p className="mt-5 max-w-[52ch] font-body text-[16px] leading-[1.7] text-ivory/74">
            {c.body}
          </p>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-28">
        <div className="heng-container">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="PROCES" heading="Od mere do postavke." />
              {c.audience && (
                <>
                  <div className="heng-rule my-8 max-w-[220px]" />
                  <ul className="flex flex-wrap gap-x-3 gap-y-2.5">
                    {c.audience.map((a) => (
                      <li key={a} className="rounded-sm border border-ink/15 px-3 py-1.5 font-body text-[12px] text-ink/60">
                        {a}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <ol className="lg:col-span-7">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 0.07}>
                  <div className="flex gap-6 border-t border-ink/12 py-7">
                    <span className="font-display text-[13px] tabular-nums" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-[19px]" style={{ fontWeight: 600 }}>{s.title}</h3>
                      <p className="mt-2 max-w-[52ch] font-body text-[15px] leading-relaxed text-ink/65">{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-24 lg:py-28">
        <div className="heng-container">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="UPIT"
                heading="Opišite prostor."
                body="Što više detalja pošaljete, precizniji je predlog. Odgovaramo lično — bez automatskih poruka."
              />
              <ImageReveal className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-sm lg:block">
                <Image
                  src="/assets/heng/interiors/kuhinja-vinska-nisa.jpg"
                  alt="Osvetljena vinska niša sa zidnim nosačima za flaše u savremenoj kuhinji"
                  fill sizes="30vw" className="object-cover"
                />
              </ImageReveal>
            </div>
            <div className="lg:col-span-8">
              <InquiryForm prefill={searchParams.proizvod} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
