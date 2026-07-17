import 'server-only';
import { createServerSupabase } from '@/lib/supabase/server';
import type {
  Category, HomepageSection, Order, ProductFull, ProjectInquiry, SiteSettings,
} from '@/types';
import { SITE_SETTINGS } from '@/lib/data/fixtures';

/**
 * Admin upiti idu kroz korisnikovu sesiju — RLS je i dalje aktivan,
 * pa politika `is_admin()` ostaje poslednja provera.
 */
function sb() {
  const client = createServerSupabase();
  if (!client) throw new Error('Supabase nije konfigurisan.');
  return client;
}

const FULL = '*, category:categories(*), variants:product_variants(*), media:product_media(*)';

export async function adminProducts(): Promise<ProductFull[]> {
  const { data, error } = await sb().from('products').select(FULL).order('sort_order');
  if (error) throw error;
  return (data ?? []) as unknown as ProductFull[];
}

export async function adminProduct(id: string): Promise<ProductFull | null> {
  const { data, error } = await sb().from('products').select(FULL).eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as unknown as ProductFull) ?? null;
}

export async function adminCategories(): Promise<Category[]> {
  const { data, error } = await sb().from('categories').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function adminOrders(filters?: { status?: string; q?: string }): Promise<Order[]> {
  let query = sb().from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.q) {
    const term = filters.q.replace(/[%,()]/g, '');
    query = query.or(`reference.ilike.%${term}%,full_name.ilike.%${term}%,email.ilike.%${term}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Order[];
}

export async function adminOrder(id: string): Promise<Order | null> {
  const { data, error } = await sb()
    .from('orders').select('*, items:order_items(*)').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as unknown as Order) ?? null;
}

export async function adminInquiries(status?: string): Promise<ProjectInquiry[]> {
  let query = sb().from('project_inquiries').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProjectInquiry[];
}

export async function adminHomepage(): Promise<HomepageSection[]> {
  const { data, error } = await sb().from('homepage_sections').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as HomepageSection[];
}

export async function adminSettings(): Promise<SiteSettings> {
  const { data, error } = await sb().from('site_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return { ...SITE_SETTINGS, ...((data ?? {}) as Partial<SiteSettings>) };
}

export interface DashboardData {
  activeProducts: number;
  categories: number;
  pendingOrders: number;
  recentOrders: Order[];
  recentInquiries: ProjectInquiry[];
  lowStock: { id: string; name: string; finish: string | null; stock: number }[];
  totalValue: number;
}

export async function adminDashboard(): Promise<DashboardData> {
  const client = sb();

  const [products, categories, orders, inquiries, variants] = await Promise.all([
    client.from('products').select('id', { count: 'exact', head: true })
      .eq('is_published', true).eq('is_archived', false),
    client.from('categories').select('id', { count: 'exact', head: true }),
    client.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
    client.from('project_inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    client.from('product_variants').select('id, stock, finish_name, product_id, products(name)')
      .lte('stock', 3).eq('is_active', true).order('stock'),
  ]);

  const allOrders = (orders.data ?? []) as unknown as Order[];

  return {
    activeProducts: products.count ?? 0,
    categories: categories.count ?? 0,
    pendingOrders: allOrders.filter((o) => o.status === 'nova' || o.status === 'potvrdjena').length,
    recentOrders: allOrders.slice(0, 5),
    recentInquiries: (inquiries.data ?? []) as ProjectInquiry[],
    lowStock: ((variants.data ?? []) as unknown as {
      id: string; stock: number; finish_name: string; products: { name: string } | null;
    }[]).slice(0, 6).map((v) => ({
      id: v.id,
      name: v.products?.name ?? '—',
      finish: v.finish_name,
      stock: v.stock,
    })),
    totalValue: allOrders
      .filter((o) => o.status !== 'otkazana')
      .reduce((s, o) => s + Number(o.total_rsd ?? 0), 0),
  };
}
