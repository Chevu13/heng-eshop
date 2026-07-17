import type { ProductFull } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
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
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 3) * 0.06}>
          <ProductCard product={p} priority={i < 3} />
        </Reveal>
      ))}
    </ul>
  );
}
