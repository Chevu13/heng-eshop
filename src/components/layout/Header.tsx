'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Wordmark } from '@/components/ui/Wordmark';
import { useCart } from '@/components/cart/CartProvider';

/** Navigacija prema finalnoj strukturi: Proizvodi · Inspiracija · O nama · Kontakt. */
const NAV = [
  { href: '/kolekcija', label: 'Proizvodi' },
  { href: '/inspiracija', label: 'Inspiracija' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/kontakt', label: 'Kontakt' },
];

/** Ikonica korpe — jedina akcija u headeru, bez tekstualnih dugmadi. */
function BagIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      className={className} fill="none"
      stroke="currentColor" strokeWidth="1.2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M4.5 7.5h15l-1.1 12.2a1.6 1.6 0 0 1-1.6 1.45H7.2a1.6 1.6 0 0 1-1.6-1.45L4.5 7.5Z" />
      <path d="M8.75 10V6.6a3.25 3.25 0 0 1 6.5 0V10" />
    </svg>
  );
}

/** Ista linijska ikonografija kao BagIcon — bez fill-a, oblih krajeva. */
function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      className={className} fill="none"
      stroke="currentColor" strokeWidth="1.2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Header({
  transparentOnTop = false, scrolled = false, instagramUrl = null,
}: { transparentOnTop?: boolean; scrolled?: boolean; instagramUrl?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
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
          backdropFilter: solid && !menuOpen ? 'saturate(1.1) blur(6px)' : undefined,
          borderBottom: solid && !menuOpen ? '1px solid rgba(28,20,22,0.08)' : '1px solid transparent',
        }}
      >
        <div className="heng-container flex h-[64px] items-center justify-between gap-8 lg:h-[74px]">
          <Wordmark
            className="text-[34px] lg:text-[40px]"
            tone={overHero || menuOpen ? 'ivory' : 'maroon'}
          />

          <nav aria-label="Glavna navigacija" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-gold font-body text-[11px] font-medium uppercase tracking-eyebrow"
                    style={{
                      color: fg,
                      opacity: pathname.startsWith(item.href)
                        ? 1
                        : overHero || menuOpen ? 0.92 : 0.72,
                    }}
                    aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank" rel="noopener noreferrer"
                className="-m-2 hidden p-2 transition-opacity duration-300 hover:opacity-70 lg:block"
                style={{ color: fg }}
                aria-label="HENG na Instagramu"
              >
                <InstagramIcon className="h-[22px] w-[22px]" />
              </a>
            )}

            <button
              onClick={openDrawer}
              className="relative -m-2 p-2 transition-opacity duration-300 hover:opacity-70"
              style={{ color: fg }}
              aria-label={`Korpa, ${count} ${count === 1 ? 'stavka' : 'stavki'}`}
            >
              <BagIcon className="h-[28px] w-[28px] lg:h-[30px] lg:w-[30px]" />
              {count > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill px-1 font-body text-[10px] font-semibold leading-none text-ivory"
                  style={{ background: 'var(--color-maroon)' }}
                >
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="-m-2 p-2 lg:hidden"
              style={{ color: fg }}
              aria-expanded={menuOpen}
              aria-controls="mobilni-meni"
              aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
            >
              <span className="block h-[18px] w-[28px]" aria-hidden="true">
                <span
                  className="block h-px w-full transition-transform duration-300 ease-heng"
                  style={{
                    background: 'currentColor',
                    transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className="mt-[7px] block h-px w-full transition-all duration-300 ease-heng"
                  style={{
                    background: 'currentColor',
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="mt-[7px] block h-px w-full transition-transform duration-300 ease-heng"
                  style={{
                    background: 'currentColor',
                    transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobilni-meni"
            className="fixed inset-0 z-40 flex flex-col justify-start px-8 pt-[104px] lg:hidden"
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
                    <Link href={item.href} className="display-caps block py-3 text-[30px] text-ivory">
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="heng-rule my-8" />
            <p className="font-body text-[11px] uppercase tracking-eyebrow text-ivory/55">
              Dizajn za vino. Detalj za prostor.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
