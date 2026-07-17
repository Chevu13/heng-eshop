import Link from 'next/link';
import type { ProductFull } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { EmptyState } from '@/components/ui/EmptyState';

export function FeaturedCollection({
  content, products,
}: {
  content: { eyebrow?: string; heading?: string; body?: string };
  products: ProductFull[];
}) {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="heng-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={content.eyebrow}
            heading={content.heading ?? ''}
            body={content.body}
          />
          <Reveal delay={0.1}>
            <Link href="/kolekcija" className="link-gold font-body text-[13px] uppercase tracking-eyebrow">
              Cela kolekcija
            </Link>
          </Reveal>
        </div>

        <div className="heng-rule my-12" />

        {products.length === 0 ? (
          <EmptyState
            title="Kolekcija se priprema"
            description="Prvi modeli biće objavljeni uskoro. Do tada nam možete poslati upit za konkretan prostor."
            actionLabel="Pošalji upit"
            actionHref="/projekti"
          />
        ) : (
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.07}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
