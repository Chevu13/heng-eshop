'use client';

import { useTransition } from 'react';
import {
  archiveProduct, duplicateProduct, toggleFeatured, togglePublished,
} from '@/lib/admin/actions';

export function ProductRowActions({
  id, isPublished, isFeatured, isArchived,
}: { id: string; isPublished: boolean; isFeatured: boolean; isArchived: boolean }) {
  const [pending, start] = useTransition();

  const btn = 'link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/55 disabled:opacity-40';

  return (
    <div className="flex justify-end gap-4 whitespace-nowrap">
      <button
        className={btn} disabled={pending}
        onClick={() => start(async () => { await togglePublished(id, !isPublished); })}
      >
        {isPublished ? 'Sakrij' : 'Objavi'}
      </button>
      <button
        className={btn} disabled={pending}
        onClick={() => start(async () => { await toggleFeatured(id, !isFeatured); })}
      >
        {isFeatured ? 'Ukloni izdvajanje' : 'Izdvoj'}
      </button>
      <button
        className={btn} disabled={pending}
        onClick={() => start(async () => { await duplicateProduct(id); })}
      >
        Dupliraj
      </button>
      <button
        className={btn} disabled={pending}
        onClick={() => start(async () => { await archiveProduct(id, !isArchived); })}
      >
        {isArchived ? 'Vrati' : 'Arhiviraj'}
      </button>
    </div>
  );
}
