import Image, { getImageProps } from 'next/image';
import type { CSSProperties } from 'react';
import { resolveMediaUrl } from '@/lib/admin/media';

/**
 * Fotografija preko celog okvira (`fill`) sa opcionom posebnom slikom za
 * telefon. Kada `mobileSrc` postoji, `<picture>` bira jednu od dve — browser
 * preuzima samo onu koja se prikazuje.
 */
export function ArtImage({
  src, mobileSrc, alt, sizes, className, style, priority = false, quality = 82,
  breakpoint = 767,
}: {
  src: string; mobileSrc?: string | null; alt: string; sizes: string;
  className?: string; style?: CSSProperties; priority?: boolean; quality?: number;
  /** Poslednja širina (px) na kojoj važi slika za telefon. */
  breakpoint?: number;
}) {
  const common = { alt, fill: true, sizes, quality, priority, className, style };

  if (!mobileSrc) return <Image {...common} alt={alt} src={resolveMediaUrl(src)} />;

  const { props: { srcSet: mobileSet } } = getImageProps({ ...common, src: resolveMediaUrl(mobileSrc), sizes: '100vw' });
  const { props: desktop } = getImageProps({ ...common, src: resolveMediaUrl(src) });

  return (
    <picture>
      <source media={`(max-width: ${breakpoint}px)`} srcSet={mobileSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element -- <picture> traži običan <img>; props dolaze iz getImageProps */}
      <img {...desktop} alt={alt} />
    </picture>
  );
}
