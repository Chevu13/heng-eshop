import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { CatalogGrid } from '@/components/catalog/CatalogGrid';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import {
  filterProducts, getCategories, getCategory, getProducts, type CatalogFilters as Filters,
} from '@/lib/data/repository';

export const revalidate = 300;

interface PageProps {
  params: { categorySlug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategory(params.categorySlug);
  if (!category) return { title: 'Kategorija nije pronađena' };
  return {
    title: category.title,
    description: category.description ?? undefined,
    alternates: { canonical: `/kolekcija/${category.slug}` },
    openGraph: {
      title: category.title,
      description: category.description ?? undefined,
      images: category.cover_image ? [category.cover_image] : undefined,
    },
  };
}

function param(sp: PageProps['searchParams'], key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [category, products, categories] = await Promise.all([
    getCategory(params.categorySlug), getProducts(), getCategories(),
  ]);
  if (!category || !category.is_published) notFound();

  const filters: Filters = {
    category: category.slug,
    q: param(searchParams, 'q'),
    finish: param(searchParams, 'finish'),
    availability: param(searchParams, 'availability') as Filters['availability'],
    sort: param(searchParams, 'sort') as Filters['sort'],
  };
  const filtered = filterProducts(products, filters);
  const hasFilters = Boolean(filters.q || filters.finish || filters.availability || filters.sort);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Kolekcija', url: '/kolekcija' },
          { name: category.title, url: `/kolekcija/${category.slug}` },
        ])}
      />
      <PageHeader
        eyebrow="KOLEKCIJA"
        title={category.title}
        description={category.description ?? undefined}
        crumbs={[{ label: 'Kolekcija', href: '/kolekcija' }, { label: category.title }]}
      />

      <section className="bg-ivory-2 pb-28">
        <div className="heng-container">
          <Suspense fallback={<div className="h-40" />}>
            <CatalogFilters
              categories={categories}
              activeCategory={category.slug}
              total={filtered.length}
            />
          </Suspense>
          <div className="heng-rule my-12" />
          <CatalogGrid products={filtered} filtered={hasFilters} />
        </div>
      </section>
    </>
  );
}
