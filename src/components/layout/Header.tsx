'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Wordmark } from '@/components/ui/Wordmark';
import { useCart } from '@/components/cart/CartProvider';
import { SearchOverlay } from './SearchOverlay';

const NAV = [
  { href: '/kolekcija', label: 'Kolekcija' },
  { href: '/inspiracija', label: 'Inspiracija' },
  { href: '/projekti', label: 'Projekti' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/kontakt', label: 'Kontakt' },
];

export function Header({
  transparentOnTop = false, scrolled = false,
}: { transparentOnTop?: boolean; scrolled?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openDrawer } = useCart();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Transparentno stanje važi samo na vrhu hero sekcije.
  const overHero = transparentOnTop && !scrolled;
  const solid = !overHero;
  const fg = overHero || menuOpen ? 'var(--color-ivory)' : 'var(--color-ink)';

  return (
    <>
      <header
        className="relative z-50 transition-colors duration-500 ease-heng"
        style={{
          background: menuOpen
            ? 'transparent'
            : solid
              ? 'rgba(247,244,240,0.94)'
              : 'transparent',
          backdropFilter: solid && !menuOpen ? 'saturate(1.1)' : undefined,
          borderBottom: solid && !menuOpen ? '1px solid rgba(28,20,22,0.08)' : '1px solid transparent',
        }}
      >
        <div className="heng-container flex h-[68px] items-center justify-between gap-8 lg:h-[76px]">
          <Wordmark
            className="text-[26px] lg:text-[28px]"
            tone={overHero || menuOpen ? 'ivory' : 'maroon'}
          />

          <nav aria-label="Glavna navigacija" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-gold font-body text-[13px] uppercase tracking-eyebrow"
                    style={{ color: fg, opacity: pathname.startsWith(item.href) ? 1 : 0.78 }}
                    aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden font-body text-[13px] uppercase tracking-eyebrow lg:inline-block link-gold"
              style={{ color: fg }}
            >
              Pretraga
            </button>
            <button
              onClick={openDrawer}
              className="font-body text-[13px] uppercase tracking-eyebrow link-gold"
              style={{ color: fg }}
              aria-label={`Korpa, ${count} ${count === 1 ? 'stavka' : 'stavki'}`}
            >
              Korpa{count > 0 && <span aria-hidden="true"> ({count})</span>}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="font-body text-[13px] uppercase tracking-eyebrow lg:hidden"
              style={{ color: fg }}
              aria-expanded={menuOpen}
              aria-controls="mobilni-meni"
            >
              {menuOpen ? 'Zatvori' : 'Meni'}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobilni-meni"
            className="fixed inset-0 z-40 flex flex-col justify-center px-8 lg:hidden"
            style={{ background: 'var(--color-maroon-deep)' }}
            initial={{ opacity: 0, y: reduce ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobilna navigacija">
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="block py-3 font-display text-[30px] text-ivory"
                      style={{ fontWeight: 600 }}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="heng-rule my-8" />
            <button
              onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
              className="text-left font-body text-[13px] uppercase tracking-eyebrow text-ivory/70"
            >
              Pretraga
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
