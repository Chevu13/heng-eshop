import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, ImageReveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { breadcrumbLd, JsonLd } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'O nama',
  description:
    'HENG proizvodi nosače za vino i čaše od eloksirane legure aluminijuma — arhitektonski detalj za savremene enterijere.',
  alternates: { canonical: '/o-nama' },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'O nama', url: '/o-nama' }])} />

      <section className="relative flex min-h-[64svh] items-end overflow-hidden" style={{ background: 'var(--color-maroon-deep)' }}>
        <Image
          src="/assets/heng/lifestyle/heng-cheers-kljucni-vizual.jpg"
          alt="HENG wordmark preko fotografije bara sa obešenim čašama"
          fill priority quality={82} sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(51,25,30,0.92) 0%, rgba(51,25,30,0.35) 58%, rgba(51,25,30,0.4) 100%)' }}
        />
        <div className="heng-container relative z-10 pb-14 pt-36">
          <p className="heng-eyebrow mb-5" style={{ color: 'var(--color-gold)' }}>O NAMA</p>
          <h1
            className="max-w-[16ch] font-display text-[clamp(2rem,5.4vw,3.1rem)] leading-[1.08] text-ivory"
            style={{ fontWeight: 700, letterSpacing: '-0.015em' }}
          >
            Detalji koji prostoru daju karakter.
          </h1>
        </div>
      </section>

      <section className="bg-ivory-2 py-24 lg:py-32">
        <div className="heng-container">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="font-display text-[clamp(1.4rem,2.6vw,1.75rem)] leading-[1.4]" style={{ fontWeight: 500 }}>
                  HENG je srpski brend koji pravi nosače za vinske flaše i čaše od eloksirane legure
                  aluminijuma.
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="heng-rule my-9 max-w-[240px]" />
              </Reveal>
              <Reveal delay={0.12}>
                <div className="space-y-5 font-body text-[16px] leading-[1.75] text-ink/68">
                  <p>
                    Polica zauzima prostor. Nosač ga oslobađa. Ta razlika je početna tačka svega što
                    radimo — umesto elementa koji se dodaje enterijeru, tražimo liniju koja iz njega
                    proizlazi.
                  </p>
                  <p>
                    Svaki model rešava tačno jedan zadatak: flašu, čašu ili niz koji od zida pravi
                    vinski kutak. Geometrija je svedena namerno — profil, prorez i dva otvora za
                    montažu. Sve ostalo ostaje fotografiji, materijalu i svetlu.
                  </p>
                  <p>
                    Radimo sa arhitektama, dizajnerima enterijera, izvođačima i vlasnicima prostora
                    koji od detalja očekuju istu preciznost kao od konstrukcije.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <p
                  className="mt-10 font-display text-[20px] italic leading-snug"
                  style={{ color: 'var(--color-maroon)', fontWeight: 500 }}
                >
                  Dizajn koji ne zauzima prostor — već ga oblikuje.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <ImageReveal className="relative aspect-[4/5] overflow-hidden rounded-sm lg:sticky lg:top-28">
                <Image
                  src="/assets/heng/interiors/vitrina-sa-casama.jpg"
                  alt="Zatamnjena vitrina sa policama i nosačima za čaše"
                  fill sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover"
                />
              </ImageReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32" style={{ background: 'var(--color-maroon)' }}>
        <div className="heng-container">
          <SectionHeading
            eyebrow="PRISTUP"
            heading="Oblikovano da traje."
            body="Materijal, obrada i tolerancija biraju se tako da detalj izdrži svakodnevnu upotrebu i ostane dosledan kroz celu postavku."
            tone="light"
            align="center"
          />

          <div className="mx-auto mt-16 grid max-w-4xl gap-px sm:grid-cols-3" style={{ background: 'rgba(184,147,79,0.28)' }}>
            {[
              { k: 'Materijal', v: 'Eloksirana legura aluminijuma' },
              { k: 'Završne obrade', v: 'Crna mat · Grafit · Zlatna · Saten zlatna' },
              { k: 'Primena', v: 'Kuhinje, barovi, vinski zidovi, enterijeri po meri' },
            ].map((item, i) => (
              <Reveal key={item.k} delay={i * 0.08}>
                <div className="h-full px-6 py-8 text-center" style={{ background: 'var(--color-maroon)' }}>
                  <p className="heng-eyebrow mb-3" style={{ color: 'var(--color-gold)' }}>{item.k}</p>
                  <p className="font-body text-[14px] leading-relaxed text-ivory/78">{item.v}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-14 text-center">
              <Link href="/kolekcija" className="btn btn-outline-light">Pogledaj kolekciju</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
