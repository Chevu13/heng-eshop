'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/** Suzdržano otkrivanje sadržaja pri skrolu. Poštuje prefers-reduced-motion. */
export function Reveal({
  children, delay = 0, y = 18, className = '', as = 'div',
}: {
  children: ReactNode; delay?: number; y?: number; className?: string;
  as?: 'div' | 'section' | 'li' | 'span';
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/**
 * Otkrivanje fotografije.
 *
 * Namerno se animiraju opacity i scale, a NE clip-path: `clip-path` se u SSR
 * HTML-u ispisuje kao `inset(0 0 100% 0)`, pa fotografija ostaje potpuno
 * odsečena dok animacija ne odradi — a ako izostane, nikada se ne pojavi.
 * `amount: 0.05` okida čim je 5% elementa vidljivo, što je pouzdano i za
 * elemente više od ekrana (npr. hero kolone od 86vh).
 */
export function ImageReveal({
  children, className = '',
}: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 1.03 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
