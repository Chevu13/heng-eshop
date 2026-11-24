import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, ImageReveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import { getSection } from '@/lib/data/repository';
import { HOMEPAGE_SECTIONS } from '@/lib/data/fixtures';
import { resolveMediaUrl } from '@/lib/admin/media';

interface AboutContent {
  heroImage?: string; heroAlt?: string; heading?: string; lead?: string; body?: string;
  quote?: string; image?: string; imageAlt?: string;
  approachHeading?: string; approachBody?: string;
  items?: { title?: string; text?: string }[];
}

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'O nama',
  description:
    'HENG proizvodi nosače za vino i čaše od eloksirane legure aluminijuma — arhitektonski detalj za savremene enterijere.',
  alternates: { canonical: '/o-nama' },
};

export default async function AboutPage() {
  const row = await getSection('about');
  const seed = (HOMEPAGE_SECTIONS.find((s) => s.key === 'about')?.content ?? {}) as AboutContent;
  const c: AboutContent = { ...seed, ...((row?.content ?? {}) as AboutContent) };
  const paragraphs = (c.body ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'O nama', url: '/o-nama' }])} />

      <section className="relative flex min-h-[64svh] items-end overflow-hidden" style={{ background: 'var(--color-maroon-deep)' }}>
        <Image
          src={resolveMediaUrl(c.heroImage || seed.heroImage || '')}
          alt={c.heroAlt ?? ''}
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
            className="display-caps max-w-[16ch] text-[clamp(2rem,5.4vw,3.3rem)] text-ivory"
          >
            {c.heading}
          </h1>
        </div>
      </section>

      <section className="bg-ivory-2 py-24 lg:py-32">
        <div className="heng-container">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="font-display text-[clamp(1.4rem,2.6vw,1.75rem)] leading-[1.4]" style={{ fontWeight: 500 }}>
                  {c.lead}
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="heng-rule my-9 max-w-[240px]" />
              </Reveal>
              <Reveal delay={0.12}>
                <div className="space-y-5 font-body text-[16px] leading-[1.75] text-ink/68">
                  {paragraphs.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
                </div>
              </Reveal>

              {c.quote && (
                <Reveal delay={0.18}>
                  <p
                    className="mt-10 font-display text-[20px] italic leading-snug"
                    style={{ color: 'var(--color-maroon)', fontWeight: 500 }}
                  >
                    {c.quote}
                  </p>
                </Reveal>
              )}
            </div>

            <div className="lg:col-span-5">
              <ImageReveal className="relative aspect-[4/5] overflow-hidden rounded-sm lg:sticky lg:top-28">
                <Image
                  src={resolveMediaUrl(c.image || seed.image || '')}
                  alt={c.imageAlt ?? ''}
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
            heading={c.approachHeading ?? ''}
            body={c.approachBody}
            tone="light"
            align="center"
          />

          <div className="mx-auto mt-16 grid max-w-4xl gap-px sm:grid-cols-3" style={{ background: 'rgba(184,147,79,0.28)' }}>
            {(c.items ?? []).map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="h-full px-6 py-8 text-center" style={{ background: 'var(--color-maroon)' }}>
                  <p className="heng-eyebrow mb-3" style={{ color: 'var(--color-gold)' }}>{item.title}</p>
                  <p className="font-body text-[14px] leading-relaxed text-ivory/78">{item.text}</p>
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
