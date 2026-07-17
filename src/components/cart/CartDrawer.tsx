'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { useCart } from './CartProvider';
import { formatRsd } from '@/lib/format';

export function CartDrawer() {
  const { lines, drawerOpen, closeDrawer, subtotal, hasRequestItems, setQuantity, remove } = useCart();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Korpa"
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-[420px] flex-col bg-ivory-2"
            initial={{ x: reduce ? 0 : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: reduce ? 0 : '100%' }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-[19px]" style={{ fontWeight: 600 }}>Korpa</h2>
              <button
                onClick={closeDrawer}
                className="link-gold font-body text-[13px] uppercase tracking-eyebrow"
              >
                Zatvori
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="font-body text-[15px] text-ink/60">Korpa je prazna.</p>
                <Link href="/kolekcija" onClick={closeDrawer} className="btn btn-outline mt-6">
                  Pogledaj kolekciju
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                  {lines.map((l) => (
                    <li key={`${l.productId}-${l.variantId}`} className="flex gap-4 py-5">
                      <Link
                        href={`/proizvod/${l.slug}`} onClick={closeDrawer}
                        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-ivory"
                      >
                        {l.image && (
                          <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/proizvod/${l.slug}`} onClick={closeDrawer}
                          className="font-display text-[16px] hover:text-maroon"
                          style={{ fontWeight: 600 }}
                        >
                          {l.name}
                        </Link>
                        {l.finishName && (
                          <p className="mt-0.5 font-body text-[13px] text-ink/55">{l.finishName}</p>
                        )}
                        <p className="mt-1 font-body text-[14px]">{formatRsd(l.unitPrice)}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-ink/15 rounded-sm">
                            <button
                              className="px-2.5 py-1 font-body text-[14px] hover:text-maroon"
                              aria-label={`Smanji količinu za ${l.name}`}
                              onClick={() => setQuantity(l.productId, l.variantId, l.quantity - 1)}
                            >−</button>
                            <span className="min-w-[28px] text-center font-body text-[13px]">{l.quantity}</span>
                            <button
                              className="px-2.5 py-1 font-body text-[14px] hover:text-maroon"
                              aria-label={`Povećaj količinu za ${l.name}`}
                              onClick={() => setQuantity(l.productId, l.variantId, l.quantity + 1)}
                            >+</button>
                          </div>
                          <button
                            onClick={() => remove(l.productId, l.variantId)}
                            className="link-gold font-body text-[12px] uppercase tracking-eyebrow text-ink/50"
                          >
                            Ukloni
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-ink/10 px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="heng-eyebrow text-ink/55">Međuzbir</span>
                    <span className="font-display text-[20px]" style={{ fontWeight: 600 }}>
                      {formatRsd(subtotal)}
                    </span>
                  </div>
                  {hasRequestItems && (
                    <p className="mt-2 font-body text-[13px] text-ink/55">
                      Korpa sadrži stavke sa cenom na upit — konačan iznos potvrđujemo pre isporuke.
                    </p>
                  )}
                  <Link href="/korpa" onClick={closeDrawer} className="btn btn-primary mt-5 w-full">
                    Pregled korpe
                  </Link>
                  <Link href="/porucivanje" onClick={closeDrawer} className="btn btn-outline mt-3 w-full">
                    Poručivanje
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
