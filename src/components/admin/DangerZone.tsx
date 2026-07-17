'use client';

import { ActionButton } from './FormShell';
import { archiveProduct, deleteProduct, duplicateProduct } from '@/lib/admin/actions';

export function DangerZone({ productId, productName, isArchived }: {
  productId: string; productName: string; isArchived: boolean;
}) {
  return (
    <section
      className="rounded-sm border p-6"
      style={{ borderColor: 'rgba(198,23,143,0.28)', background: 'rgba(198,23,143,0.03)' }}
    >
      <h2 className="font-display text-[18px]" style={{ fontWeight: 600 }}>Nepovratne radnje</h2>
      <p className="mt-1 max-w-[70ch] font-body text-[13px] text-ink/58">
        Arhiviranje sklanja proizvod sa sajta, ali čuva podatke i istoriju porudžbina. Brisanje
        uklanja proizvod, njegove varijante i galeriju — porudžbine ostaju sačuvane sa zapamćenim
        nazivom stavke.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <ActionButton
          action={() => duplicateProduct(productId)}
          label="Dupliraj proizvod"
          pendingLabel="Kopiranje…"
        />
        <ActionButton
          action={() => archiveProduct(productId, !isArchived)}
          label={isArchived ? 'Vrati iz arhive' : 'Arhiviraj'}
          pendingLabel="Obrada…"
        />
        <ActionButton
          action={() => deleteProduct(productId)}
          label="Obriši trajno"
          tone="danger"
          pendingLabel="Brisanje…"
          confirm={`Trajno obrisati „${productName}”? Radnja se ne može poništiti.`}
        />
      </div>
    </section>
  );
}
