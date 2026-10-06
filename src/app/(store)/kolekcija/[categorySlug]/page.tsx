import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionLayout } from '@/components/catalog/CollectionLayout';
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
  const hasFilters = Boolean(filters.q || filters.finish || filters.availability || filters.sort);
  const fallbackImage = products.find((p) => p.category_id === category.id)?.media[0]?.url;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Kolekcija', url: '/kolekcija' },
          { name: category.title, url: `/kolekcija/${category.slug}` },
        ])}
      />
      <CollectionLayout
        title={category.title}
        description={category.description}
        image={category.cover_image ?? fallbackImage ?? '/assets/heng/lifestyle/case-nad-barom-heng.jpg'}
        imageAlt={category.title}
        categories={categories}
        allProducts={products}
        scope={products.filter((p) => p.category?.slug === category.slug)}
        products={filterProducts(products, filters)}
        activeCategory={category.slug}
        filtered={hasFilters}
      />
    </>
  );
}
