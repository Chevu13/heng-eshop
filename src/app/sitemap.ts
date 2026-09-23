import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/env';
import { getArticles, getCategories, getProducts } from '@/lib/data/repository';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, articles] = await Promise.all([getProducts(), getCategories(), getArticles()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/kolekcija`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/u-prostoru`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/projekti`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/o-nama`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/kontakt`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/dostava-i-povrat`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/uslovi-koriscenja`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/politika-privatnosti`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  return [
    ...staticRoutes,
    ...categories.map((c) => ({
      url: `${SITE_URL}/kolekcija/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${SITE_URL}/u-prostoru/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/proizvod/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];
}
