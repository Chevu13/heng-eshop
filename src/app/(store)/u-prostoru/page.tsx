import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard } from '@/components/journal/ArticleCard';
import { Reveal } from '@/components/ui/Reveal';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import { getArticles } from '@/lib/data/repository';
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
  const all = await getArticles();
  const articles = active ? all.filter((a) => a.category === active) : all;

  const tabs = [{ slug: undefined, label: 'Sve' }, ...ARTICLE_CATEGORIES];

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'U prostoru', url: '/u-prostoru' }])} />

      {/* Isti baner kao na strani Proizvodi: tekst levo, fotografija desno. */}
      <section className="grid bg-maroon-deep md:min-h-[440px] md:grid-cols-2 lg:min-h-[540px]">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-8 md:py-16 lg:px-12 xl:px-16">
          <h1 className="title-bold text-[clamp(1.4rem,2.2vw,1.9rem)] text-ivory">U prostoru</h1>
          <p className="mt-4 max-w-[46ch] font-body text-[15px] leading-[1.75] text-ivory/85 sm:text-[16px]">
            Istražite kako HENG proizvodi nalaze svoje mesto u različitim enterijerima — od modernih do
            klasičnih, uz praktične savete i inspirativne priče.
          </p>
        </div>
        <div className="relative aspect-[4/3] md:aspect-auto">
          <Image
            src="/assets/heng/interiors/mermer-detalj-flase-i-case.jpg"
            alt="Mermerni zid sa HENG nosačima za flaše i letvom za čaše"
            fill priority quality={82}
            sizes="(max-width: 768px) 100vw, 50vw"
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
          <Reveal>
            <div className="text-center">
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
