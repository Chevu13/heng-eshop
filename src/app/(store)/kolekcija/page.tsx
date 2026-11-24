import type { Metadata } from 'next';
import { CollectionLayout } from '@/components/catalog/CollectionLayout';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import {
  filterProducts, getCategories, getProducts, getSection, type CatalogFilters as Filters,
} from '@/lib/data/repository';
import { HOMEPAGE_SECTIONS } from '@/lib/data/fixtures';
import { resolveMediaUrl } from '@/lib/admin/media';

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
  const [products, categories, bannerRow] = await Promise.all([
    getProducts(), getCategories(), getSection('collection_banner'),
  ]);
  const banner = {
    ...(HOMEPAGE_SECTIONS.find((s) => s.key === 'collection_banner')?.content ?? {}),
    ...(bannerRow?.content ?? {}),
  } as { heading?: string; body?: string; mediaUrl?: string; mediaAlt?: string };

  const filters: Filters = {
    q: param(searchParams, 'q'),
    finish: param(searchParams, 'finish'),
    availability: param(searchParams, 'availability') as Filters['availability'],
    sort: param(searchParams, 'sort') as Filters['sort'],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Kolekcija', url: '/kolekcija' }])} />
      <CollectionLayout
        title={banner.heading ?? 'Svi proizvodi'}
        description={banner.body}
        image={resolveMediaUrl(banner.mediaUrl || '/assets/heng/lifestyle/case-nad-barom-heng.jpg')}
        imageAlt={banner.mediaAlt ?? ''}
        categories={categories}
        allProducts={products}
        scope={products}
        products={filterProducts(products, filters)}
        filtered={Object.values(filters).some(Boolean)}
      />
    </>
  );
}
