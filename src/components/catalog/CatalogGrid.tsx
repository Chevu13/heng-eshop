import type { ProductFull } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

export function CatalogGrid({ products, filtered }: { products: ProductFull[]; filtered: boolean }) {
  if (!products.length) {
    return filtered ? (
      <EmptyState
        title="Nema rezultata za izabrane filtere"
        description="Pokušajte sa drugom obradom ili poništite filtere da vidite celu kolekciju."
        actionLabel="Cela kolekcija"
        actionHref="/kolekcija"
      />
    ) : (
      <EmptyState
        title="Kolekcija se priprema"
        description="Proizvodi još nisu objavljeni. Pošaljite nam upit i javljamo se sa predlogom postavke."
        actionLabel="Pošalji upit"
        actionHref="/projekti"
      />
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-y-10">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
