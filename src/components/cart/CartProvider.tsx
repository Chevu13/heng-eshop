'use client';

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import type { CartLine } from '@/types';

const STORAGE_KEY = 'heng.cart.v1';

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;              // zbir stavki sa poznatom cenom
  hasRequestItems: boolean;      // postoji bar jedna stavka „na upit”
  ready: boolean;
  drawerOpen: boolean;
  lastAdded: string | null;
  add: (line: CartLine) => void;
  setQuantity: (productId: string, variantId: string | null, qty: number) => void;
  remove: (productId: string, variantId: string | null) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const same = (a: CartLine, productId: string, variantId: string | null) =>
  a.productId === productId && a.variantId === variantId;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed as CartLine[]);
      }
    } catch {
      // Oštećen zapis — korpa počinje prazna.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage nedostupan (privatni režim) — korpa ostaje u memoriji.
    }
  }, [lines, ready]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => same(l, line.productId, line.variantId));
      if (idx === -1) return [...prev, line];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: Math.min(99, next[idx].quantity + line.quantity) };
      return next;
    });
    setLastAdded(`${line.name}${line.finishName ? ` — ${line.finishName}` : ''}`);
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, variantId: string | null, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !same(l, productId, variantId))
        : prev.map((l) => (same(l, productId, variantId) ? { ...l, quantity: Math.min(99, qty) } : l)),
    );
  }, []);

  const remove = useCallback((productId: string, variantId: string | null) => {
    setLines((prev) => prev.filter((l) => !same(l, productId, variantId)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const subtotal = lines.reduce(
      (s, l) => s + (l.unitPrice !== null ? l.unitPrice * l.quantity : 0), 0,
    );
    return {
      lines, count, subtotal,
      hasRequestItems: lines.some((l) => l.unitPrice === null),
      ready, drawerOpen, lastAdded,
      add, setQuantity, remove, clear,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [lines, ready, drawerOpen, lastAdded, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart mora biti unutar <CartProvider>.');
  return ctx;
}
