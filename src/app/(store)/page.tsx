import type { Metadata } from 'next';
import { Hero, type HeroContent } from '@/components/home/Hero';
import { CategorySplit, type CategorySplitContent } from '@/components/home/CategorySplit';
import { MaterialSection, type MaterialContent } from '@/components/home/MaterialSection';
import { getHomepageSections, getSettings } from '@/lib/data/repository';
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
 * Početna strana ima fiksnu strukturu od četiri sekcije (+ footer iz layouta):
 * HERO → 01 KATEGORIJE → 02 DRŽAČI ZA VINO I ČAŠE → 03 RUČKE OD PRIRODNOG KAMENA.
 * Redosled je u kodu, a ne iz `sort_order`, da stari redovi u bazi ne mogu
 * da ga poremete. Tekstovi i fotografije i dalje se menjaju iz admina.
 */
export default async function HomePage() {
  const sections = await getHomepageSections();

  // Sadržaj iz baze ima prednost; polja koja u bazi ne postoje (npr. CTA
  // dodat posle redizajna) popunjavaju se iz seed sadržaja.
  const content = <T,>(key: string): T => ({
    ...(HOMEPAGE_SECTIONS.find((s) => s.key === key)?.content ?? {}),
    ...(sections.find((s) => s.key === key)?.content ?? {}),
  }) as T;
  const visible = (key: string) => Boolean(sections.find((s) => s.key === key)?.is_visible);

  return (
    <>
      {visible('hero') && <Hero content={content<HeroContent>('hero')} />}
      {visible('categories') && (
        <CategorySplit content={content<CategorySplitContent>('categories')} />
      )}
      {visible('material') && <MaterialSection content={content<MaterialContent>('material')} />}
      {/* Obrnut raspored: tekst levo, fotografija desno — dijagonala u odnosu na sekciju iznad. */}
      {visible('handles') && (
        <MaterialSection
          content={content<MaterialContent>('handles')}
          reverse
          fit="cover"
          tone="shade"
        />
      )}
    </>
  );
}
