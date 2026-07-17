import { CartProvider } from '@/components/cart/CartProvider';
import { StoreShell } from '@/components/layout/StoreShell';
import { Footer } from '@/components/layout/Footer';
import { getCategories, getSection, getSettings } from '@/lib/data/repository';
import { JsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/env';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, announcement] = await Promise.all([
    getSettings(), getCategories(), getSection('announcement'),
  ]);
  const a = (announcement?.content ?? {}) as { text?: string; href?: string; linkLabel?: string };

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.brand_name,
    url: SITE_URL,
    description: settings.seo_description ?? undefined,
    logo: `${SITE_URL}/assets/heng/lifestyle/heng-cheers-kljucni-vizual.jpg`,
    sameAs: settings.instagram_url ? [settings.instagram_url] : undefined,
    email: settings.contact_email ?? undefined,
    telephone: settings.phone ?? undefined,
    areaServed: 'RS',
  };

  return (
    <CartProvider>
      <a
        href="#glavni-sadrzaj"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[99] focus:rounded-sm focus:bg-maroon focus:px-4 focus:py-2 focus:font-body focus:text-[13px] focus:text-ivory"
      >
        Preskoči na sadržaj
      </a>
      <StoreShell
        announcement={
          announcement?.is_visible && a.text
            ? { text: a.text, href: a.href, linkLabel: a.linkLabel }
            : null
        }
      />
      <main id="glavni-sadrzaj">{children}</main>
      <Footer settings={settings} categories={categories} />
      <JsonLd data={orgLd} />
    </CartProvider>
  );
}
