import Image from 'next/image';
import Link from 'next/link';
import type { ProductFull } from '@/types';
import { Reveal, ImageReveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Tehnički pregled dimenzija — pregledno, ali bez izgleda kataloga delova. */
export function DimensionsSection({ content, products }: {
  content: { eyebrow?: string; heading?: string; body?: string };
  products: ProductFull[];
}) {
  const items = products
    .map((p) => ({
      product: p,
      image: p.media.find((m) => m.url.includes('dimenzije')),
    }))
    .filter((x) => x.image && x.product.dimensions);

  if (!items.length) return null;

  return (
    <section className="py-24 lg:py-32" style={{ background: 'var(--color-ivory)' }}>
      <div className="heng-container">
        <SectionHeading eyebrow={content.eyebrow} heading={content.heading ?? ''} body={content.body} />
        <div className="heng-rule my-12" />

        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal as="li" key={item.product.id} delay={i * 0.08}>
              <ImageReveal className="relative aspect-[3/4] overflow-hidden rounded-sm bg-ivory-2">
                <Image
                  src={item.image!.url}
                  alt={item.image!.alt ?? `${item.product.name} — dimenzije`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-contain"
                />
              </ImageReveal>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-ink/12 pt-4">
                <div>
                  <h3 className="font-display text-[18px]" style={{ fontWeight: 600 }}>
                    <Link href={`/proizvod/${item.product.slug}`} className="link-gold">
                      {item.product.name}
                    </Link>
                  </h3>
                  <p className="mt-1.5 font-body text-[13px] text-ink/55">{item.product.material}</p>
                </div>
                <p
                  className="shrink-0 font-display text-[15px] tabular-nums"
                  style={{ color: 'var(--color-maroon)', fontWeight: 600 }}
                >
                  {item.product.dimensions}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-[62ch] font-body text-[13px] leading-relaxed text-ink/50">
            Mere su navedene prema kotiranim fotografijama proizvoda (širina × dubina × visina, u
            centimetrima). Za postavke po meri pošaljite dimenzije prostora kroz projektni upit.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
