import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard } from '@/components/journal/ArticleCard';
import { InspirationGallery } from '@/components/home/InspirationGallery';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import { getArticles, getGallery } from '@/lib/data/repository';
import { ARTICLE_CATEGORIES } from '@/lib/data/articles';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'U prostoru — ideje, saveti i priče',
  description:
    'Kako HENG držači za vino i čaše i ručke od prirodnog kamena nalaze svoje mesto u enterijeru — ideje, saveti o materijalima i realizovani prostori.',
  alternates: { canonical: '/u-prostoru' },
};

export default async function InSpacePage({
  searchParams,
}: { searchParams: { kategorija?: string } }) {
  const active = ARTICLE_CATEGORIES.find((c) => c.slug === searchParams.kategorija)?.slug;
  const [all, gallery] = await Promise.all([getArticles(), getGallery()]);
  const articles = active ? all.filter((a) => a.category === active) : all;

  const tabs = [{ slug: undefined, label: 'Sve' }, ...ARTICLE_CATEGORIES];

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'U prostoru', url: '/u-prostoru' }])} />

      <section className="grid bg-maroon-deep lg:min-h-[74svh] lg:grid-cols-12">
        <div className="heng-container flex flex-col justify-end pb-14 pt-32 lg:col-span-5 lg:pb-20 lg:pr-10 lg:pt-40">
          <p className="heng-eyebrow mb-5" style={{ color: 'var(--color-gold)' }}>
            Ideje. Saveti. Priče.
          </p>
          <h1 className="display-caps text-[clamp(2.2rem,5.4vw,3.6rem)] text-ivory">U prostoru</h1>
          <p className="mt-6 max-w-[44ch] font-body text-[15px] font-light leading-[1.75] text-ivory/74 sm:text-[16px]">
            Istražite kako HENG proizvodi nalaze svoje mesto u različitim enterijerima — od modernih do
            klasičnih, uz praktične savete i inspirativne priče.
          </p>
          <a href="#clanci" className="link-arrow mt-10">
            <span>Istraži članke</span>
            <span className="link-arrow__line" aria-hidden="true" />
          </a>
        </div>
        <div className="relative aspect-[4/3] lg:col-span-7 lg:aspect-auto">
          <Image
            src="/assets/heng/interiors/mermer-detalj-flase-i-case.jpg"
            alt="Mermerni zid sa HENG nosačima za flaše i letvom za čaše"
            fill priority quality={82}
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="clanci" className="scroll-mt-24 bg-ivory-2 py-14 lg:py-20">
        <div className="heng-container">
          {/* Podkategorije — obični linkovi, pa svaka ima svoj URL i radi bez JS-a. */}
          <nav aria-label="Kategorije članaka" className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
            <ul className="flex min-w-max gap-8 border-b border-ink/12">
              {tabs.map((t) => {
                const current = t.slug === active;
                return (
                  <li key={t.label}>
                    <Link
                      href={t.slug ? `/u-prostoru?kategorija=${t.slug}#clanci` : '/u-prostoru#clanci'}
                      scroll={false}
                      aria-current={current ? 'page' : undefined}
                      className={`-mb-px block border-b py-4 font-body text-[12px] font-medium uppercase tracking-eyebrow transition-colors duration-300 ${
                        current ? 'border-gold text-ink' : 'border-transparent text-ink/55 hover:text-ink'
                      }`}
                    >
                      {t.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ul className="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {articles.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={(i % 3) * 0.08}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory py-20 lg:py-24">
        <div className="heng-container">
          <SectionHeading eyebrow="GALERIJA" heading="Postavljeno u prostor." className="mb-12" />
          <InspirationGallery items={gallery} />

          <Reveal delay={0.1}>
            <div className="mt-20 border-t border-ink/12 pt-12 text-center">
              <h2 className="mx-auto max-w-[20ch] font-display text-[30px] leading-tight" style={{ fontWeight: 400 }}>
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
