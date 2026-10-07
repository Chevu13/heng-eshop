'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

/** next/image koji pri grešci (obrisan fajl, 404) prelazi na rezervnu sliku. */
export function FallbackImage({ src, fallback, alt, ...rest }: ImageProps & { fallback?: string | null }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Greška može da stigne pre hidratacije, kad onError još nije zakačen.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed && !fallback) return null;
  return <Image {...rest} ref={ref} alt={alt} src={failed ? fallback! : src} onError={() => setFailed(true)} />;
}
