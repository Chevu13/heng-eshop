import type { Metadata } from 'next';
import { CollectionLayout } from '@/components/catalog/CollectionLayout';
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

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Kolekcija', url: '/kolekcija' }])} />
      <CollectionLayout
        title="Svi proizvodi"
        description="Nosači za vinske flaše i čaše i ručke od prirodnog kamena — ista geometrija, pažljivo birane završne obrade, za kuhinje, barove i enterijere po meri."
        image="/assets/heng/lifestyle/case-nad-barom-heng.jpg"
        imageAlt="Čaše za vino obešene na HENG nosaču iznad kućnog bara"
        categories={categories}
        scope={products}
        products={filterProducts(products, filters)}
        filtered={Object.values(filters).some(Boolean)}
      />
    </>
  );
}
