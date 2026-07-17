import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_URL } from '@/lib/env';
import { getSettings } from '@/lib/data/repository';

export const viewport: Viewport = {
  themeColor: '#4B262D',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.seo_title ?? 'HENG';
  const description = s.seo_description ?? '';
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${s.brand_name}` },
    description,
    applicationName: s.brand_name,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'sr_RS',
      siteName: s.brand_name,
      title, description,
      url: SITE_URL,
      images: [{
        url: '/assets/heng/lifestyle/heng-cheers-kljucni-vizual.jpg',
        width: 1092, height: 1092, alt: 'HENG',
      }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
    icons: { icon: '/favicon.svg' },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-Latn-RS">
      <body>{children}</body>
    </html>
  );
}
