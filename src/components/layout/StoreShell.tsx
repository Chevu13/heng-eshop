'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCart } from '@/components/cart/CartProvider';

/**
 * Fiksni gornji sloj: samo header. Iznad njega nema ničega — traka sa
 * najavom je uklonjena po zahtevu klijenta, hero počinje od samog vrha.
 * Transparentno stanje važi samo na stranama koje otvara hero medij.
 */
const TRANSPARENT_ROUTES = ['/', '/o-nama', '/projekti', '/u-prostoru'];

export function StoreShell({ instagramUrl = null }: { instagramUrl?: string | null }) {
  const pathname = usePathname();
  const { lastAdded } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const transparent = TRANSPARENT_ROUTES.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <Header transparentOnTop={transparent} scrolled={scrolled} instagramUrl={instagramUrl} />
      </div>

      {/* Odstojanje za strane bez hero medija ispod headera. */}
      {!transparent && <div aria-hidden="true" className="h-[64px] lg:h-[74px]" />}

      <CartDrawer />
      <p role="status" aria-live="polite" className="sr-only">
        {lastAdded ? `${lastAdded} dodato u korpu.` : ''}
      </p>
    </>
  );
}
