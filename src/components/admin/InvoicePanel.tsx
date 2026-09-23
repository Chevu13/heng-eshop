'use client';

import { useState } from 'react';
import { invoiceUrl, removeInvoice, sendInvoice, uploadInvoice } from '@/lib/admin/actions';
import { formatDate } from '@/lib/format';
import { ActionButton, FormShell } from './FormShell';

export function InvoicePanel({ orderId, email, path, sentAt }: {
  orderId: string; email: string; path: string | null; sentAt: string | null;
}) {
  const [replacing, setReplacing] = useState(false);

  async function open() {
    if (!path) return;
    const url = await invoiceUrl(path);
    if (url) window.open(url, '_blank', 'noopener');
  }

  const uploadForm = (
    <FormShell action={(fd) => uploadInvoice(orderId, fd)} submitLabel="Otpremi fakturu">
      <label className="field-label" htmlFor="invoice">PDF fakture</label>
      <input id="invoice" name="invoice" type="file" accept="application/pdf" required className="field cursor-pointer" />
      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-sm border border-ink/12 p-3">
        <input type="checkbox" name="send" defaultChecked className="mt-1 accent-[color:var(--color-maroon)]" />
        <span className="font-body text-[13px]">
          Odmah pošalji kupcu na <span className="break-all text-ink/60">{email}</span>
        </span>
      </label>
    </FormShell>
  );

  if (!path) return uploadForm;

  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-ink/12 p-4">
        <p className="font-body text-[14px]">Faktura je otpremljena.</p>
        <p className="mt-1 font-body text-[12px] text-ink/55">
          {sentAt ? `Poslata kupcu ${formatDate(sentAt)}.` : 'Još nije poslata kupcu.'}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <button onClick={open} className="link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/60">
            Otvori PDF
          </button>
          <button
            onClick={() => setReplacing((v) => !v)}
            className="link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/60"
          >
            {replacing ? 'Otkaži zamenu' : 'Zameni'}
          </button>
          <ActionButton
            action={() => removeInvoice(orderId)} label="Ukloni" tone="link"
            confirm="Ukloniti fakturu sa porudžbine?"
          />
        </div>
      </div>

      <ActionButton
        action={() => sendInvoice(orderId)}
        label={sentAt ? 'Pošalji ponovo' : 'Pošalji kupcu'}
        tone="primary" pendingLabel="Slanje…"
        confirm={`Poslati fakturu na ${email}?`}
      />

      {replacing && uploadForm}
    </div>
  );
}
