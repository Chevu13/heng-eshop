import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/journal/ArticleCard';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/env';
import { getArticles } from '@/lib/data/repository';
import { categoryLabel, formatArticleDate } from '@/lib/data/articles';

export const revalidate = 600;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

const find = async (slug: string) => (await getArticles()).find((a) => a.slug === slug);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = await find(params.slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/u-prostoru/${a.slug}` },
    openGraph: { type: 'article', title: a.title, description: a.excerpt, images: [a.mediaUrl], publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const all = await getArticles();
  const a = all.find((r) => r.slug === params.slug);
  if (!a) notFound();

  const related = [
    ...all.filter((r) => r.slug !== a.slug && r.category === a.category),
    ...all.filter((r) => r.slug !== a.slug && r.category !== a.category),
  ].slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'U prostoru', url: '/u-prostoru' },
          { name: a.title, url: `/u-prostoru/${a.slug}` },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.title,
          description: a.excerpt,
          image: a.mediaUrl.startsWith('http') ? a.mediaUrl : `${SITE_URL}${a.mediaUrl}`,
          datePublished: a.date,
          author: { '@type': 'Organization', name: 'HENG' },
          mainEntityOfPage: `${SITE_URL}/u-prostoru/${a.slug}`,
        }}
      />

      <article className="bg-ivory-2 pb-20 pt-12 lg:pb-28 lg:pt-16">
        <div className="heng-container max-w-[860px]">
          <nav aria-label="Putanja" className="mb-8 font-body text-[12px] text-ink/45">
            <Link href="/u-prostoru" className="link-gold">U prostoru</Link>
            <span aria-hidden="true" className="mx-2 text-ink/25">/</span>
            <Link href={`/u-prostoru?kategorija=${a.category}#clanci`} className="link-gold">
              {categoryLabel(a.category)}
            </Link>
          </nav>

          <p className="font-body text-[11px] uppercase tracking-eyebrow" style={{ color: 'var(--color-gold)' }}>
            {categoryLabel(a.category)}
            <span aria-hidden="true" className="mx-2 opacity-50">|</span>
            <time dateTime={a.date}>{formatArticleDate(a.date)}</time>
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.12]" style={{ fontWeight: 400 }}>
            {a.title}
          </h1>
          <p className="mt-6 font-body text-[17px] font-light leading-[1.75] text-ink/70">{a.excerpt}</p>
        </div>

        <div className="heng-container mt-12 max-w-[1200px]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-ivory">
            <Image src={a.mediaUrl} alt={a.mediaAlt} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
          </div>
        </div>

        <div className="heng-container mt-14 max-w-[720px] space-y-6 font-body text-[16px] font-light leading-[1.85] text-ink/80">
          {a.body.map((p) =>
            p.startsWith('## ') ? (
              <h2 key={p} className="!mt-12 font-display text-[28px] text-ink" style={{ fontWeight: 400 }}>
                {p.slice(3)}
              </h2>
            ) : (
              <p key={p}>{p}</p>
            ),
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-ivory py-20 lg:py-24">
          <div className="heng-container">
            <h2 className="display-caps mb-12 text-[28px] sm:text-[34px]" style={{ fontWeight: 400 }}>
              Pročitajte još
            </h2>
            <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {related.map((r) => (
                <li key={r.slug}><ArticleCard article={r} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
