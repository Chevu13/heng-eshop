import Image from 'next/image';
import Link from 'next/link';
import { type Article, categoryLabel, formatArticleDate } from '@/lib/data/articles';

export function ArticleCard({ article }: { article: Article }) {
  const href = `/u-prostoru/${article.slug}`;
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-ivory">
        <Image
          src={article.mediaUrl}
          alt={article.mediaAlt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          className="object-cover transition-transform duration-[1100ms] ease-heng group-hover:scale-[1.04]"
        />
      </div>
      <p className="mt-5 font-body text-[11px] uppercase tracking-eyebrow text-ink/55">
        {categoryLabel(article.category)}
        <span aria-hidden="true" className="mx-2 text-ink/25">|</span>
        <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
      </p>
      <h3 className="mt-3 font-display text-[26px] leading-[1.2]" style={{ fontWeight: 400 }}>
        {article.title}
      </h3>
      <p className="mt-3 max-w-[44ch] font-body text-[14px] font-light leading-[1.7] text-ink/65">
        {article.excerpt}
      </p>
      <Link href={href} className="link-arrow mt-auto pt-6">
        {/* Link pokriva celu karticu. */}
        <span className="absolute inset-0 z-10" aria-hidden="true" />
        <span>Pročitaj više</span>
        <span className="link-arrow__line" aria-hidden="true" />
      </Link>
    </article>
  );
}
