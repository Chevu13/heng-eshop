import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { InspirationGallery } from '@/components/home/InspirationGallery';
import { Reveal } from '@/components/ui/Reveal';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import { getGallery } from '@/lib/data/repository';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Inspiracija',
  description:
    'HENG sistemi postavljeni u realne enterijere — kuhinje, vinski zidovi, barovi i niše po meri.',
  alternates: { canonical: '/inspiracija' },
};

export default async function InspirationPage() {
  const items = await getGallery();

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Inspiracija', url: '/inspiracija' }])} />

      <section className="relative flex min-h-[58svh] items-end overflow-hidden" style={{ background: 'var(--color-maroon-deep)' }}>
        <Image
          src="/assets/heng/interiors/mermerni-zid-flase-i-case.jpg"
          alt="Mermerna niša sa nosačima za flaše i letvom za čaše"
          fill priority quality={82} sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(51,25,30,0.9) 0%, rgba(51,25,30,0.3) 60%, rgba(51,25,30,0.4) 100%)' }}
        />
        <div className="heng-container relative z-10 pb-14 pt-36">
          <p className="heng-eyebrow mb-5" style={{ color: 'var(--color-gold)' }}>INSPIRACIJA</p>
          <h1
            className="max-w-[15ch] font-display text-[clamp(2rem,5.4vw,3.1rem)] leading-[1.08] text-ivory"
            style={{ fontWeight: 700, letterSpacing: '-0.015em' }}
          >
            Postavljeno u prostor.
          </h1>
          <p className="mt-5 max-w-[50ch] font-body text-[16px] leading-[1.7] text-ivory/74">
            Realizovani enterijeri — kuhinje, vinski zidovi, barovi i niše u kojima nosač postaje deo
            arhitekture.
          </p>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 lg:py-24">
        <div className="heng-container">
          <InspirationGallery items={items} />

          <Reveal delay={0.1}>
            <div className="mt-20 border-t border-ink/12 pt-12 text-center">
              <h2 className="mx-auto max-w-[20ch] font-display text-[26px] leading-tight" style={{ fontWeight: 600 }}>
                Imate prostor koji traži svoje rešenje?
              </h2>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/projekti" className="btn btn-primary">Pošalji projektni upit</Link>
                <Link href="/kolekcija" className="btn btn-outline">Pogledaj kolekciju</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
