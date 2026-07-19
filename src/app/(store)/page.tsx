import type { Metadata } from 'next';
import { Hero, type HeroContent } from '@/components/home/Hero';
import { Statement } from '@/components/home/Statement';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { FinishSelector } from '@/components/home/FinishSelector';
import { MaterialSection } from '@/components/home/MaterialSection';
import { InspirationGallery, type GalleryItem } from '@/components/home/InspirationGallery';
import { DimensionsSection } from '@/components/home/DimensionsSection';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { InstagramSection } from '@/components/home/InstagramSection';
import { FinalCta } from '@/components/home/FinalCta';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  getFeaturedProducts, getHomepageSections, getProduct, getProducts, getSettings,
} from '@/lib/data/repository';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    // `absolute` sprečava da se globalni template („%s | HENG”) primeni na
    // naslov koji već sadrži naziv brenda.
    title: { absolute: s.seo_title ?? s.brand_name },
    description: s.seo_description ?? undefined,
    alternates: { canonical: '/' },
  };
}

export default async function HomePage() {
  const [sections, featured, products] = await Promise.all([
    getHomepageSections(), getFeaturedProducts(), getProducts(),
  ]);

  const byKey = (k: string) => sections.find((s) => s.key === k);
  const c = <T,>(k: string): T => ((byKey(k)?.content ?? {}) as T);
  const visible = (k: string) => Boolean(byKey(k)?.is_visible);

  const finishesContent = c<{ eyebrow?: string; heading?: string; body?: string; productSlug?: string }>('finishes');
  const finishProduct = finishesContent.productSlug
    ? await getProduct(finishesContent.productSlug)
    : (products[products.length - 1] ?? null);

  const featuredContent = c<{ eyebrow?: string; heading?: string; body?: string; productSlugs?: string[] }>('featured');
  const featuredList = featuredContent.productSlugs?.length
    ? featuredContent.productSlugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : featured;

  const galleryContent = c<{ eyebrow?: string; heading?: string; items?: GalleryItem[] }>('gallery');

  // Redosled sekcija poštuje sort_order iz admin panela.
  const ordered = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      {visible('hero') && <Hero content={c<HeroContent>('hero')} />}

      {ordered.map((section) => {
        if (!section.is_visible) return null;
        switch (section.key) {
          case 'statement':
            return <Statement key={section.id} content={section.content as never} />;
          case 'featured':
            return (
              <FeaturedCollection key={section.id} content={featuredContent} products={featuredList} />
            );
          case 'finishes':
            return <FinishSelector key={section.id} content={finishesContent} product={finishProduct} />;
          case 'material':
            return <MaterialSection key={section.id} content={section.content as never} />;
          case 'gallery':
            return (
              <section key={section.id} className="bg-ivory-2 pb-24 pt-14 lg:pb-32 lg:pt-20">
                <div className="heng-container">
                  <SectionHeading
                    eyebrow={galleryContent.eyebrow}
                    heading={galleryContent.heading ?? ''}
                  />
                  <div className="heng-rule my-12" />
                  <InspirationGallery items={galleryContent.items ?? []} />
                </div>
              </section>
            );
          case 'dimensions':
            return <DimensionsSection key={section.id} content={section.content as never} products={products} />;
          case 'projects':
            return <ProjectsSection key={section.id} content={section.content as never} />;
          case 'instagram':
            return <InstagramSection key={section.id} content={section.content as never} />;
          case 'final_cta':
            return <FinalCta key={section.id} content={section.content as never} />;
          default:
            return null;
        }
      })}
    </>
  );
}
