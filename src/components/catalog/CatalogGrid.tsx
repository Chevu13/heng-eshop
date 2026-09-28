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
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
      {products.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 4) * 0.05}>
          <ProductCard product={p} priority={i < 4} />
        </Reveal>
      ))}
    </ul>
  );
}
