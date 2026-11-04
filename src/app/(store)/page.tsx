import type { Metadata } from 'next';
import { Hero, type HeroContent } from '@/components/home/Hero';
import {
  HomeCategories, HomeFeatured, HomeImageTextStack, HomeStory, HomeWhy,
  type CategoryContent, type ImageTextContent, type StoryContent, type WhyContent,
} from '@/components/home/HomeSections';
import { getFeaturedProducts, getHomepageSections, getSettings } from '@/lib/data/repository';
import { HOMEPAGE_SECTIONS } from '@/lib/data/fixtures';

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

/**
 * Početna po uzoru na plookdesign.com:
 * HERO → KATEGORIJE → ZAŠTO HENG → PRIČA O BRENDU → 3 BLOKA SLIKA/TEKST
 * (držači, ručke, projekti) → IZDVOJENI PROIZVODI (+ footer iz layouta).
 * Redosled je u kodu; tekstovi i fotografije se menjaju iz admina.
 */
export default async function HomePage() {
  const [sections, featured] = await Promise.all([getHomepageSections(), getFeaturedProducts()]);

  // Sadržaj iz baze ima prednost; polja koja u bazi ne postoje popunjavaju se iz seed sadržaja.
  const content = <T,>(key: string): T => ({
    ...(HOMEPAGE_SECTIONS.find((s) => s.key === key)?.content ?? {}),
    ...(sections.find((s) => s.key === key)?.content ?? {}),
  }) as T;
  const visible = (key: string) => Boolean(sections.find((s) => s.key === key)?.is_visible);

  const blocks = ['material', 'handles', 'bespoke'].filter(visible).map((k) => content<ImageTextContent>(k));

  return (
    <>
      {visible('hero') && <Hero content={content<HeroContent>('hero')} />}
      {visible('categories') && <HomeCategories content={content<CategoryContent>('categories')} />}
      {visible('why') && <HomeWhy content={content<WhyContent>('why')} />}
      {visible('story') && <HomeStory content={content<StoryContent>('story')} />}
      <HomeImageTextStack blocks={blocks} />
      <HomeFeatured products={featured} />
    </>
  );
}
