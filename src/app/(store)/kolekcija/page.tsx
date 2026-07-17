import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { CatalogGrid } from '@/components/catalog/CatalogGrid';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import {
  filterProducts, getCategories, getProducts, type CatalogFilters as Filters,
} from '@/lib/data/repository';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Kolekcija',
  description:
    'Aluminijumski nosači za vinske flaše i čaše — modeli, završne obrade i dimenzije. HENG kolekcija.',
  alternates: { canonical: '/kolekcija' },
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function param(sp: PageProps['searchParams'], key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function CollectionPage({ searchParams }: PageProps) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const filters: Filters = {
    q: param(searchParams, 'q'),
    finish: param(searchParams, 'finish'),
    availability: param(searchParams, 'availability') as Filters['availability'],
    sort: param(searchParams, 'sort') as Filters['sort'],
  };
  const filtered = filterProducts(products, filters);
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Kolekcija', url: '/kolekcija' }])} />
      <PageHeader
        eyebrow="KOLEKCIJA"
        title="Tri modela, jedna logika."
        description="Svaki model rešava jedan zadatak u prostoru — čašu, flašu ili ceo zid. Ista geometrija, četiri završne obrade."
        crumbs={[{ label: 'Kolekcija' }]}
      />

      <section className="bg-ivory-2 pb-28">
        <div className="heng-container">
          <Suspense fallback={<div className="h-40" />}>
            <CatalogFilters categories={categories} total={filtered.length} />
          </Suspense>

          <div className="heng-rule my-12" />

          <Suspense
            fallback={
              <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => <li key={i}><ProductCardSkeleton /></li>)}
              </ul>
            }
          >
            <CatalogGrid products={filtered} filtered={hasFilters} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
