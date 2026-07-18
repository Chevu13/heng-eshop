import { cache } from 'react';
import { createPublicSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';
import type {
  Category, HomepageSection, ProductFull, SiteSettings,
} from '@/types';
import {
  CATEGORIES, GALLERY, HOMEPAGE_SECTIONS, PRODUCTS, SITE_SETTINGS,
} from './fixtures';

/**
 * Jedinstvena tačka pristupa katalogu.
 * Kada je Supabase povezan — čita se baza (RLS: samo objavljeno).
 * Kada nije — vraća se lokalni seed sadržaj kao read-only demo.
 *
 * Namerno koristi klijent BEZ kolačića: ove funkcije pozivaju i
 * `generateStaticParams` i `sitemap.ts`, koji se izvršavaju van zahteva.
 */
export const usingLocalData = !isSupabaseConfigured;

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  variants:product_variants(*),
  media:product_media(*)
`;

function sortProduct(p: ProductFull): ProductFull {
  return {
    ...p,
    variants: [...(p.variants ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    media: [...(p.media ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const sb = createPublicSupabase();
  if (!sb) return CATEGORIES.filter((c) => c.is_published);
  const { data, error } = await sb
    .from('categories').select('*')
    .eq('is_published', true).order('sort_order');
  if (error) return [];
  return (data ?? []) as Category[];
});

export const getCategory = cache(async (slug: string): Promise<Category | null> => {
  const sb = createPublicSupabase();
  if (!sb) return CATEGORIES.find((c) => c.slug === slug && c.is_published) ?? null;
  const { data } = await sb.from('categories').select('*').eq('slug', slug).maybeSingle();
  return (data as Category) ?? null;
});

export const getProducts = cache(async (): Promise<ProductFull[]> => {
  const sb = createPublicSupabase();
  if (!sb) return PRODUCTS.filter((p) => p.is_published && !p.is_archived).map(sortProduct);
  const { data, error } = await sb
    .from('products').select(PRODUCT_SELECT)
    .eq('is_published', true).eq('is_archived', false)
    .order('sort_order');
  if (error) return [];
  return ((data ?? []) as unknown as ProductFull[]).map(sortProduct);
});

export const getProduct = cache(async (slug: string): Promise<ProductFull | null> => {
  const sb = createPublicSupabase();
  if (!sb) {
    const p = PRODUCTS.find((x) => x.slug === slug && x.is_published && !x.is_archived);
    return p ? sortProduct(p) : null;
  }
  const { data } = await sb
    .from('products').select(PRODUCT_SELECT)
    .eq('slug', slug).eq('is_published', true).eq('is_archived', false)
    .maybeSingle();
  return data ? sortProduct(data as unknown as ProductFull) : null;
});

export const getFeaturedProducts = cache(async (): Promise<ProductFull[]> => {
  const all = await getProducts();
  const featured = all.filter((p) => p.is_featured);
  return (featured.length ? featured : all).slice(0, 6);
});

export const getRelatedProducts = cache(
  async (product: ProductFull): Promise<ProductFull[]> => {
    const all = await getProducts();
    const sameCat = all.filter(
      (p) => p.id !== product.id && p.category_id === product.category_id,
    );
    const rest = all.filter((p) => p.id !== product.id && p.category_id !== product.category_id);
    return [...sameCat, ...rest].slice(0, 3);
  },
);

export const getHomepageSections = cache(async (): Promise<HomepageSection[]> => {
  const sb = createPublicSupabase();
  if (!sb) return HOMEPAGE_SECTIONS.filter((s) => s.is_visible);
  const { data, error } = await sb
    .from('homepage_sections').select('*')
    .eq('is_visible', true).order('sort_order');
  if (error || !data?.length) return HOMEPAGE_SECTIONS.filter((s) => s.is_visible);
  return data as HomepageSection[];
});

export async function getSection(key: string): Promise<HomepageSection | null> {
  const list = await getHomepageSections();
  return list.find((s) => s.key === key) ?? null;
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const sb = createPublicSupabase();
  if (!sb) return SITE_SETTINGS;
  const { data, error } = await sb.from('site_settings').select('*').eq('id', 1).maybeSingle();
  if (error || !data) return SITE_SETTINGS;
  return { ...SITE_SETTINGS, ...(data as Partial<SiteSettings>) };
});

export const getGallery = cache(async () => {
  const section = await getSection('gallery');
  const items = (section?.content as { items?: typeof GALLERY })?.items;
  return items?.length ? items : GALLERY;
});

// ---------- Filtriranje kataloga ----------
export interface CatalogFilters {
  category?: string;
  finish?: string;
  q?: string;
  availability?: 'na-stanju' | 'na-upit';
  sort?: 'najnovije' | 'cena-rastuce' | 'cena-opadajuce' | 'izdvojeno';
}

export function filterProducts(products: ProductFull[], f: CatalogFilters): ProductFull[] {
  let list = [...products];

  if (f.category) list = list.filter((p) => p.category?.slug === f.category);

  if (f.finish) {
    list = list.filter((p) => p.variants.some((v) => v.is_active && v.finish_code === f.finish));
  }

  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter((p) =>
      [p.name, p.short_description, p.material, p.dimensions, ...(p.tags ?? [])]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(q)),
    );
  }

  if (f.availability === 'na-stanju') {
    list = list.filter((p) => p.stock > 0 || p.variants.some((v) => v.stock > 0));
  } else if (f.availability === 'na-upit') {
    list = list.filter((p) => p.price_on_request || p.price_rsd === null);
  }

  switch (f.sort) {
    case 'cena-rastuce':
      list.sort((a, b) => (a.price_rsd ?? Infinity) - (b.price_rsd ?? Infinity));
      break;
    case 'cena-opadajuce':
      list.sort((a, b) => (b.price_rsd ?? -Infinity) - (a.price_rsd ?? -Infinity));
      break;
    case 'izdvojeno':
      list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
      break;
    default:
      list.sort((a, b) => a.sort_order - b.sort_order);
  }
  return list;
}
