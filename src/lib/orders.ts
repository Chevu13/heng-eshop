import { createAdminSupabase } from '@/lib/supabase/server';
import { PRODUCTS } from '@/lib/data/fixtures';
import { resolvePrice } from '@/lib/pricing';
import type { CheckoutInput } from '@/lib/validation';
import type { ProductFull, SiteSettings } from '@/types';

export interface PricedItem {
  productId: string;
  variantId: string | null;
  productName: string;
  finishName: string | null;
  sku: string | null;
  unitPrice: number | null;
  quantity: number;
  lineTotal: number | null;
}

export interface PricedOrder {
  items: PricedItem[];
  subtotal: number;
  delivery: number;
  total: number;
  hasRequestItems: boolean;
}

export class OrderError extends Error {
  constructor(message: string, readonly field?: string) {
    super(message);
  }
}

/**
 * Ponovna provera na serveru: cena i postojanje varijante uzimaju se
 * iz izvora istine, nikada iz podataka koje je poslao klijent.
 */
export async function priceOrder(
  input: CheckoutInput, settings: SiteSettings,
): Promise<PricedOrder> {
  const sb = createAdminSupabase();
  const ids = Array.from(new Set(input.items.map((i) => i.productId)));

  let products: ProductFull[];
  if (sb) {
    const { data, error } = await sb
      .from('products')
      .select('*, category:categories(*), variants:product_variants(*), media:product_media(*)')
      .in('id', ids)
      .eq('is_published', true)
      .eq('is_archived', false);
    if (error) throw new OrderError('Katalog trenutno nije dostupan. Pokušajte ponovo.');
    products = (data ?? []) as unknown as ProductFull[];
  } else {
    products = PRODUCTS.filter((p) => ids.includes(p.id) && p.is_published && !p.is_archived);
  }

  const items: PricedItem[] = [];

  for (const line of input.items) {
    const product = products.find((p) => p.id === line.productId);
    if (!product) throw new OrderError('Jedan proizvod iz korpe više nije dostupan.');

    const variant = line.variantId
      ? product.variants.find((v) => v.id === line.variantId && v.is_active)
      : null;
    if (line.variantId && !variant) {
      throw new OrderError(`Izabrana obrada za „${product.name}” više nije dostupna.`);
    }

    const price = resolvePrice(product, variant);

    items.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      productName: product.name,
      finishName: variant?.finish_name ?? null,
      sku: variant?.sku ?? product.sku ?? null,
      unitPrice: price.effective,
      quantity: line.quantity,
      lineTotal: price.effective !== null ? price.effective * line.quantity : null,
    });
  }

  const subtotal = items.reduce((s, i) => s + (i.lineTotal ?? 0), 0);
  const hasRequestItems = items.some((i) => i.unitPrice === null);
  const freeDelivery =
    settings.free_delivery_threshold_rsd !== null &&
    subtotal >= settings.free_delivery_threshold_rsd;
  const delivery = freeDelivery ? 0 : settings.delivery_cost_rsd;

  return { items, subtotal, delivery, total: subtotal + delivery, hasRequestItems };
}
