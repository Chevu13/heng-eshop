'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCart } from '@/components/cart/CartProvider';

/**
 * Fiksni gornji sloj: crna traka sa akcijom (kad je upisana u adminu,
 * Početna → Hero → Obaveštenje o akciji) pa header.
 * Transparentno stanje važi samo na stranama koje otvara hero medij.
 */
const TRANSPARENT_ROUTES = ['/o-nama', '/projekti'];

export function StoreShell({ instagramUrl = null, notice = null, noticeHref = null }: {
  instagramUrl?: string | null; notice?: string | null; noticeHref?: string | null;
}) {
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
      <div className="fixed inset-x-0 top-0 z-50" style={notice ? ({ '--notice-h': '36px' } as React.CSSProperties) : undefined}>
        {notice && (noticeHref ? (
          <Link href={noticeHref} className="hero-notice hover:text-gold">{notice}</Link>
        ) : (
          <p className="hero-notice">{notice}</p>
        ))}
        <Header transparentOnTop={transparent} scrolled={scrolled} instagramUrl={instagramUrl} />
      </div>

      {/* Odstojanje za strane bez hero medija ispod headera. */}
      {!transparent && <div aria-hidden="true" className="h-[64px] lg:h-[74px]" />}
      {notice && !transparent && <div aria-hidden="true" className="h-9" />}

      <CartDrawer />
      <p role="status" aria-live="polite" className="sr-only">
        {lastAdded ? `${lastAdded} dodato u korpu.` : ''}
      </p>
    </>
  );
}
