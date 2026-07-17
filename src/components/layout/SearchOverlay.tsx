'use client';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    onClose();
    router.push(term ? `/kolekcija?q=${encodeURIComponent(term)}` : '/kolekcija');
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog" aria-modal="true" aria-label="Pretraga kolekcije"
          className="fixed inset-0 z-[80] flex items-start justify-center px-6 pt-[22vh]"
          style={{ background: 'rgba(51,25,30,0.96)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 font-body text-[13px] uppercase tracking-eyebrow text-ivory/70 hover:text-amber"
          >
            Zatvori
          </button>
          <form onSubmit={submit} className="w-full max-w-2xl">
            <label htmlFor="pretraga" className="heng-eyebrow mb-4 block" style={{ color: 'var(--color-gold)' }}>
              Pretraga
            </label>
            <input
              id="pretraga" ref={inputRef} type="search" value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Model, obrada, dimenzija…"
              className="w-full border-b border-ivory/25 bg-transparent pb-4 font-display text-[28px] text-ivory outline-none placeholder:text-ivory/30 focus:border-gold sm:text-[36px]"
              style={{ fontWeight: 600 }}
            />
            <p className="mt-5 font-body text-[13px] text-ivory/50">
              Pritisnite Enter za pretragu kolekcije.
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
