'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { AnnouncementBar } from './AnnouncementBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCart } from '@/components/cart/CartProvider';

/**
 * Fiksni gornji sloj: najava + header. Najava se pri skrolu sklapa,
 * tako da header ostaje vizuelno lagan i uvek u punom kontrastu.
 * Transparentno stanje važi samo na stranama koje otvara hero medij.
 */
const TRANSPARENT_ROUTES = ['/', '/o-nama', '/projekti', '/inspiracija'];

export interface Announcement { text: string; href?: string; linkLabel?: string }

export function StoreShell({ announcement }: { announcement: Announcement | null }) {
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
        {announcement && (
          <AnnouncementBar
            text={announcement.text}
            href={announcement.href}
            linkLabel={announcement.linkLabel}
            collapsed={scrolled}
          />
        )}
        <Header transparentOnTop={transparent} scrolled={scrolled} />
      </div>

      {/* Odstojanje za strane bez hero medija ispod headera. */}
      {!transparent && (
        <div
          aria-hidden="true"
          className={announcement ? 'h-[104px] lg:h-[112px]' : 'h-[68px] lg:h-[76px]'}
        />
      )}

      <CartDrawer />
      <p role="status" aria-live="polite" className="sr-only">
        {lastAdded ? `${lastAdded} dodato u korpu.` : ''}
      </p>
    </>
  );
}
