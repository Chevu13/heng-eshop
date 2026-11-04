import Image from 'next/image';
import Link from 'next/link';
import type { ProductFull } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

/*
 * Sekcije početne strane po uzoru na plookdesign.com: jednostavni naslovi,
 * puno vazduha, blokovi u blagim tonovima. Sve u jednoj koloni na telefonu.
 */

const BUTTON =
  'inline-block bg-maroon-deep px-9 py-3.5 font-body text-[16px] text-ivory transition-opacity hover:opacity-90';

// ---------------------------------------------------------------- Kategorije
export interface CategoryTile {
  title: string; href: string; mediaUrl: string; mediaAlt?: string;
  /** Fokus fotografije, npr. „center 35%”. */
  mediaPosition?: string;
  // Stara polja (opis, CTA, slika za telefon) ostaju u bazi, ali se ne prikazuju.
  body?: string; ctaLabel?: string; mediaUrlMobile?: string | null;
}
export interface CategoryContent { heading?: string; items?: CategoryTile[] }

export function HomeCategories({ content }: { content: CategoryContent }) {
  const items = content.items ?? [];
  if (!items.length) return null;
  return (
    <section className="bg-ivory-2 py-14 lg:py-20">
      <div className="heng-container">
        <h2 className="home-heading text-[32px] lg:text-[48px]">{content.heading ?? 'Kolekcija.'}</h2>
        <ul className={`mt-8 grid gap-10 lg:mt-10 lg:gap-4 ${items.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {items.map((c) => (
            <li key={c.title}>
              <Link href={c.href} className="group block">
                <div className="relative aspect-square overflow-hidden bg-ivory">
                  <Image
                    src={c.mediaUrl} alt={c.mediaAlt ?? c.title} fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ objectPosition: c.mediaPosition ?? 'center' }}
                  />
                </div>
                <p className="mt-4 flex items-center gap-2 font-body text-[20px] text-ink lg:text-[22px]">
                  {c.title}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Zašto HENG
const ICONS: Record<string, JSX.Element> = {
  help: <path d="M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-1v-6h3M4 13v4a2 2 0 0 0 2 2h1v-6H4" />,
  shield: <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />,
  ruler: <path d="M3 17 17 3l4 4L7 21l-4-4Zm4-4 2 2m1-5 2 2m1-5 2 2" />,
  truck: <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
};
export interface WhyContent { heading?: string; items?: { icon?: string; title: string; text: string }[] }

export function HomeWhy({ content }: { content: WhyContent }) {
  const items = content.items ?? [];
  if (!items.length) return null;
  return (
    <section className="bg-ivory-2 pb-16 pt-6 lg:pb-20">
      <div className="heng-container">
        <h2 className="home-heading text-center text-[32px] lg:text-[48px]">{content.heading ?? 'Zašto HENG'}</h2>
        <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {items.map((it) => (
            <li key={it.title} className="text-center">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto h-7 w-7 text-maroon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                {ICONS[it.icon ?? ''] ?? ICONS.shield}
              </svg>
              <h3 className="mt-4 font-body text-[20px] text-ink">{it.title}</h3>
              <p className="mx-auto mt-2 max-w-[28ch] font-body text-[15px] leading-[1.75] text-ink/65">{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Priča o brendu
export interface StoryContent { heading?: string; body?: string; ctaLabel?: string; ctaHref?: string }

export function HomeStory({ content }: { content: StoryContent }) {
  return (
    <section className="py-16 text-center lg:py-20" style={{ background: '#f1e4e2' }}>
      <div className="heng-container max-w-[1000px]">
        <h2 className="home-heading text-[30px] lg:text-[48px]">{content.heading}</h2>
        {content.body && (
          <p className="mx-auto mt-6 max-w-[70ch] font-body text-[16px] leading-[1.8] text-ink/70 lg:text-[18px]">{content.body}</p>
        )}
        {content.ctaLabel && content.ctaHref && (
          <Link href={content.ctaHref} className={`${BUTTON} mt-8`}>{content.ctaLabel}</Link>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Slika + tekst
export interface ImageTextContent {
  heading?: string; body?: string; mediaUrl?: string; mediaAlt?: string;
  ctaLabel?: string; ctaHref?: string;
  // Polja stare sekcije, zadržana radi kompatibilnosti sa sadržajem u bazi.
  eyebrow?: string; points?: { title: string; text: string }[];
}

/** Blokovi „fotografija | tekst” koji se smenjuju levo-desno, kao na Plook-u. */
export function HomeImageTextStack({ blocks }: { blocks: ImageTextContent[] }) {
  const TINTS = ['#f6efe1', '#efeae4', '#f6efe1'];
  if (!blocks.length) return null;
  return (
    <section className="bg-ivory-2 lg:pb-4">
      <div className="lg:heng-container">
        {blocks.map((b, i) => (
          <div key={b.heading ?? i} className="grid md:grid-cols-2">
            {b.mediaUrl && (
              <div className={`relative aspect-[4/3] md:aspect-auto md:min-h-[440px] ${i % 2 ? 'md:order-2' : ''}`}>
                <Image src={b.mediaUrl} alt={b.mediaAlt ?? ''} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
              </div>
            )}
            <div className="flex flex-col justify-center px-6 py-12 md:px-14 lg:px-20" style={{ background: TINTS[i % TINTS.length] }}>
              <h2 className="home-heading text-[26px] lg:text-[32px]">{b.heading}</h2>
              {b.body && <p className="mt-4 max-w-[48ch] font-body text-[16px] leading-[1.75] text-ink/70">{b.body}</p>}
              {b.ctaLabel && b.ctaHref && (
                <div><Link href={b.ctaHref} className={`${BUTTON} mt-7`}>{b.ctaLabel}</Link></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Izdvojeni proizvodi
export function HomeFeatured({ products }: { products: ProductFull[] }) {
  if (!products.length) return null;
  return (
    <section className="bg-ivory-2 py-14 lg:py-20">
      <div className="heng-container">
        <div className="flex items-end justify-between gap-6">
          <h2 className="home-heading text-[32px] lg:text-[48px]">Izdvojeni proizvodi</h2>
          <Link href="/kolekcija" className="hidden shrink-0 font-body text-[16px] underline underline-offset-4 md:block">
            Pogledaj sve
          </Link>
        </div>
        <ul className="mt-8 grid gap-10 md:grid-cols-3 md:gap-4 lg:mt-10">
          {products.slice(0, 3).map((p, i) => (
            <li key={p.id}><ProductCard product={p} priority={i === 0} /></li>
          ))}
        </ul>
        <Link href="/kolekcija" className={`${BUTTON} mt-10 w-full text-center md:hidden`}>Pogledaj sve</Link>
      </div>
    </section>
  );
}
