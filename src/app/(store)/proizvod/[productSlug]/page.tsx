import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductCard } from '@/components/product/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/env';
import { getProduct, getProducts, getRelatedProducts, getSettings } from '@/lib/data/repository';
import { startingPrice } from '@/lib/pricing';

export const revalidate = 300;

interface PageProps { params: { productSlug: string } }

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ productSlug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [product, settings] = await Promise.all([getProduct(params.productSlug), getSettings()]);
  if (!product) return { title: 'Proizvod nije pronađen' };

  // SEO naslov unet u adminu često već sadrži naziv brenda — zato `absolute`.
  const title = product.seo_title ?? `${product.name} | ${settings.brand_name}`;
  const description = product.seo_description ?? product.short_description ?? undefined;
  const image = product.og_image ?? product.media.find((m) => m.is_cover)?.url;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/proizvod/${product.slug}` },
    openGraph: {
      type: 'website',
      title, description,
      url: `${SITE_URL}/proizvod/${product.slug}`,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.productSlug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const price = startingPrice(product);

  /**
   * Strukturirani podaci: cena i dostupnost se izostavljaju kada model
   * ide „na upit” — nikada se ne prijavljuje izmišljen iznos.
   */
  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    sku: product.sku ?? undefined,
    material: product.material ?? undefined,
    brand: { '@type': 'Brand', name: 'HENG' },
    image: product.media
      .filter((m) => m.kind === 'image')
      .map((m) => `${SITE_URL}${m.url}`),
    url: `${SITE_URL}/proizvod/${product.slug}`,
  };

  if (!price.onRequest && price.effective !== null) {
    productLd.offers = {
      '@type': 'Offer',
      priceCurrency: 'RSD',
      price: price.effective,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/proizvod/${product.slug}`,
    };
  }

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Kolekcija', url: '/kolekcija' },
          ...(product.category
            ? [{ name: product.category.title, url: `/kolekcija/${product.category.slug}` }]
            : []),
          { name: product.name, url: `/proizvod/${product.slug}` },
        ])}
      />

      <div className="bg-ivory-2 pb-8 pt-14 lg:pt-20">
        <div className="heng-container">
          <nav aria-label="Putanja">
            <ol className="flex flex-wrap items-center gap-2 font-body text-[12px] text-ink/45">
              <li><a href="/" className="link-gold">Početna</a></li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-ink/25">/</span>
                <a href="/kolekcija" className="link-gold">Kolekcija</a>
              </li>
              {product.category && (
                <li className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-ink/25">/</span>
                  <a href={`/kolekcija/${product.category.slug}`} className="link-gold">
                    {product.category.title}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-ink/25">/</span>
                <span aria-current="page" className="text-ink/70">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="bg-ivory py-24">
          <div className="heng-container">
            <Reveal>
              <h2 className="font-display text-[26px]" style={{ fontWeight: 600 }}>
                Iz iste kolekcije
              </h2>
            </Reveal>
            <div className="heng-rule my-10" />
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 0.07}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
