import type { ProductFull, ProductVariant } from '@/types';

export interface ResolvedPrice {
  onRequest: boolean;
  regular: number | null;
  sale: number | null;
  effective: number | null;
}

function saleActive(p: { sale_starts_at?: string | null; sale_ends_at?: string | null }): boolean {
  const now = Date.now();
  if (p.sale_starts_at && new Date(p.sale_starts_at).getTime() > now) return false;
  if (p.sale_ends_at && new Date(p.sale_ends_at).getTime() < now) return false;
  return true;
}

/** Cena varijante ima prioritet nad cenom proizvoda. */
export function resolvePrice(
  product: ProductFull, variant?: ProductVariant | null,
): ResolvedPrice {
  const regular = variant?.price_rsd ?? product.price_rsd ?? null;
  const saleRaw = variant?.sale_price_rsd ?? product.sale_price_rsd ?? null;
  const sale = saleRaw !== null && saleActive(product) ? saleRaw : null;

  if (product.price_on_request || regular === null) {
    return { onRequest: true, regular: null, sale: null, effective: null };
  }
  return { onRequest: false, regular, sale, effective: sale ?? regular };
}

export function startingPrice(product: ProductFull): ResolvedPrice {
  if (product.price_on_request && product.price_rsd === null) {
    const withPrice = product.variants.filter((v) => v.is_active && v.price_rsd !== null);
    if (!withPrice.length) return { onRequest: true, regular: null, sale: null, effective: null };
    const cheapest = withPrice.reduce((a, b) => ((a.price_rsd ?? 0) <= (b.price_rsd ?? 0) ? a : b));
    return resolvePrice({ ...product, price_on_request: false }, cheapest);
  }
  return resolvePrice(product);
}

export function stockFor(product: ProductFull, variant?: ProductVariant | null): number {
  return variant ? variant.stock : product.stock;
}
