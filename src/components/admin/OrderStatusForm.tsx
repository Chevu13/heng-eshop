'use client';

import { FormShell } from './FormShell';
import { updateOrder } from '@/lib/admin/actions';
import type { OrderStatus } from '@/types';

const STATUSES: { value: OrderStatus; label: string; hint: string }[] = [
  { value: 'nova', label: 'Nova', hint: 'Primljena, još nije obrađena.' },
  { value: 'potvrdjena', label: 'Potvrđena', hint: 'Kupac je potvrdio iznos i rok.' },
  { value: 'u_pripremi', label: 'U pripremi', hint: 'Priprema se za slanje.' },
  { value: 'poslata', label: 'Poslata', hint: 'Predata kurirskoj službi.' },
  { value: 'zavrsena', label: 'Završena', hint: 'Isporučena i naplaćena.' },
  { value: 'otkazana', label: 'Otkazana', hint: 'Ne ulazi u zbir vrednosti.' },
];

export function OrderStatusForm({ id, status, internalNote }: {
  id: string; status: OrderStatus; internalNote: string | null;
}) {
  return (
    <FormShell action={(fd) => updateOrder(id, fd)} submitLabel="Sačuvaj">
      <fieldset>
        <legend className="field-label">Status</legend>
        <div className="space-y-2">
          {STATUSES.map((s) => (
            <label
              key={s.value}
              className="flex cursor-pointer items-start gap-3 rounded-sm border border-ink/12 p-3"
            >
              <input
                type="radio" name="status" value={s.value} defaultChecked={status === s.value}
                className="mt-1 accent-[color:var(--color-maroon)]"
              />
              <span>
                <span className="block font-body text-[14px]">{s.label}</span>
                <span className="mt-0.5 block font-body text-[12px] text-ink/50">{s.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="internal_note" className="field-label">Interna beleška</label>
        <textarea
          id="internal_note" name="internal_note" rows={5}
          className="field resize-y" defaultValue={internalNote ?? ''}
          placeholder="Vidljivo samo u admin panelu."
        />
      </div>
    </FormShell>
  );
}
