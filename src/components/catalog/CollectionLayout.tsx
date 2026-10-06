import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Category, ProductFull } from '@/types';
import { FINISHES } from '@/lib/data/fixtures';
import { CatalogFilters, type Facet } from './CatalogFilters';
import { CatalogGrid } from './CatalogGrid';

/**
 * Zajednički raspored za /kolekcija i /kolekcija/[kategorija]:
 * baner (tekst levo, fotografija desno) → kategorije u krugovima →
 * traka sa filterima i sortiranjem → mreža od 4 proizvoda u redu.
 */
export function CollectionLayout({
  title, description, image, imageAlt, categories, allProducts, scope, products, activeCategory, filtered,
}: {
  title: string; description?: string | null; image: string; imageAlt: string;
  categories: Category[];
  /** Svi proizvodi sajta — rezervna slika za krug kategorije. */
  allProducts: ProductFull[];
  /** Svi proizvodi strane (pre filtera) — za broj pored svake opcije. */
  scope: ProductFull[];
  products: ProductFull[]; activeCategory?: string; filtered: boolean;
}) {
  // Kategorija bez naslovne slike dobija fotografiju svog prvog proizvoda.
  const circleImage = (c: Category) => {
    if (c.cover_image) return c.cover_image;
    const media = allProducts.find((p) => p.category?.slug === c.slug && p.media.length)?.media;
    return (media?.find((m) => m.is_cover) ?? media?.[0])?.url;
  };

  const facets: Facet[] = [
    {
      key: 'finish', label: 'Završna obrada',
      options: FINISHES.map((f) => ({
        value: f.code, label: f.name, swatch: f.swatch,
        count: scope.filter((p) => p.variants.some((v) => v.is_active && v.finish_code === f.code)).length,
      })),
    },
    {
      key: 'availability', label: 'Cena',
      options: [{
        value: 'na-upit', label: 'Cena na upit',
        count: scope.filter((p) => p.price_on_request || p.price_rsd === null).length,
      }],
    },
  ];

  return (
    <>
      <section className="grid bg-maroon-deep md:min-h-[440px] md:grid-cols-2 lg:min-h-[540px]">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-8 md:py-16 lg:px-12 xl:px-16">
          <h1 className="title-bold text-[clamp(1.4rem,2.2vw,1.9rem)] text-ivory">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-[46ch] font-body text-[15px] leading-[1.75] text-ivory/85 sm:text-[16px]">
              {description}
            </p>
          )}
        </div>
        <div className="relative aspect-[4/3] md:aspect-auto">
          <Image src={image} alt={imageAlt} fill priority quality={82} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
      </section>

      <nav aria-label="Kategorije" className="bg-ivory-2 pt-10 lg:pt-12">
        <ul className="flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:gap-6 lg:gap-8">
          {categories.map((c) => {
            const active = c.slug === activeCategory;
            return (
              <li key={c.id} className="shrink-0 first:ml-auto last:mr-auto">
                <Link
                  href={active ? '/kolekcija' : `/kolekcija/${c.slug}`}
                  aria-current={active ? 'page' : undefined}
                  className="group flex w-[84px] flex-col items-center text-center sm:w-[150px]"
                >
                  <span
                    className="relative block h-[76px] w-[76px] overflow-hidden rounded-full bg-ivory transition sm:h-[150px] sm:w-[150px]"
                    style={{ boxShadow: active ? '0 0 0 2px var(--color-gold)' : undefined }}
                  >
                    {circleImage(c) && (
                      <Image
                        src={circleImage(c)!} alt="" fill sizes="150px"
                        className="object-cover transition-transform duration-700 ease-heng group-hover:scale-[1.06]"
                      />
                    )}
                  </span>
                  <span
                    className="mt-3 font-body text-[13px] leading-snug sm:text-[14px]"
                    style={{ fontWeight: active ? 600 : 500, textDecoration: active ? 'underline' : undefined, textUnderlineOffset: 4 }}
                  >
                    {c.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="bg-ivory-2 pb-24 pt-10 lg:pt-12">
        {/* Puna širina sa 20 px sa strane (na telefonu mreža ide do ivice). */}
        <div className="px-5">
          <Suspense fallback={<div className="h-8" />}>
            <CatalogFilters facets={facets} total={products.length} />
          </Suspense>
          <div className="-mx-5 mt-6 md:mx-0">
            <CatalogGrid products={products} filtered={filtered} />
          </div>
        </div>
      </section>
    </>
  );
}
