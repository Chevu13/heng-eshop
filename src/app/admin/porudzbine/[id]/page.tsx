import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { adminOrder } from '@/lib/admin/queries';
import { AdminHeading, Badge, Card } from '@/components/admin/AdminUI';
import { OrderStatusForm } from '@/components/admin/OrderStatusForm';
import { formatRsd, formatDate, statusLabel, paymentLabel, CENA_NA_UPIT } from '@/lib/format';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  await requireAdmin();
  const order = await adminOrder(params.id);
  return { title: order ? `Porudžbina ${order.reference}` : 'Porudžbina' };
}

export default async function AdminOrderPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const order = await adminOrder(params.id);
  if (!order) notFound();

  return (
    <>
      <AdminHeading
        title={order.reference}
        description={`Primljena ${formatDate(order.created_at)}`}
        action={<Link href="/admin/porudzbine" className="btn btn-outline">Nazad</Link>}
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <Badge tone={order.status === 'nova' ? 'magenta' : 'neutral'}>{statusLabel(order.status)}</Badge>
        <Badge tone="muted">{paymentLabel(order.payment)}</Badge>
        {order.has_request_items && <Badge tone="gold">Sadrži stavke na upit</Badge>}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>Stavke</h2>
            <ul className="divide-y divide-ink/10">
              {(order.items ?? []).map((i) => (
                <li key={i.id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                  <div className="min-w-0">
                    <p className="font-body text-[14px]">{i.product_name}</p>
                    <p className="mt-0.5 font-body text-[12px] text-ink/50">
                      {[i.finish_name, i.sku].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-body text-[13px] tabular-nums">
                      {i.unit_price_rsd === null
                        ? <span className="text-ink/50">{CENA_NA_UPIT}</span>
                        : formatRsd(Number(i.unit_price_rsd))}
                    </p>
                    <p className="font-body text-[12px] text-ink/45">× {i.quantity}</p>
                    {i.line_total_rsd !== null && (
                      <p className="mt-1 font-body text-[13px] tabular-nums">
                        {formatRsd(Number(i.line_total_rsd))}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="heng-rule my-6" />

            <dl className="space-y-2 font-body text-[14px]">
              <div className="flex justify-between">
                <dt className="text-ink/60">Međuzbir</dt><dd className="tabular-nums">{formatRsd(Number(order.subtotal_rsd))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">Dostava</dt><dd className="tabular-nums">{formatRsd(Number(order.delivery_rsd))}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-2">
                <dt className="heng-eyebrow text-ink/55">Ukupno</dt>
                <dd className="font-display text-[18px] tabular-nums" style={{ fontWeight: 600 }}>
                  {formatRsd(Number(order.total_rsd))}
                </dd>
              </div>
            </dl>

            {order.has_request_items && (
              <p className="mt-5 border-l-2 pl-3 font-body text-[13px] leading-relaxed text-ink/58"
                 style={{ borderColor: 'var(--color-gold)' }}>
                Stavke sa cenom na upit nisu uračunate u zbir. Iznos se dopunjuje ručno pri potvrdi.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>Kupac</h2>
            <dl className="grid gap-5 sm:grid-cols-2">
              {[
                { k: 'Ime i prezime', v: order.full_name },
                { k: 'Telefon', v: order.phone, href: `tel:${order.phone.replace(/\s/g, '')}` },
                { k: 'Email', v: order.email, href: `mailto:${order.email}` },
                { k: 'Adresa', v: order.address },
                { k: 'Grad', v: order.city },
                { k: 'Poštanski broj', v: order.postal_code },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="field-label mb-1">{row.k}</dt>
                  <dd className="font-body text-[14px]">
                    {row.href ? <a href={row.href} className="link-gold">{row.v}</a> : row.v}
                  </dd>
                </div>
              ))}
              {order.note && (
                <div className="sm:col-span-2">
                  <dt className="field-label mb-1">Napomena kupca</dt>
                  <dd className="whitespace-pre-line font-body text-[14px] text-ink/70">{order.note}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="mb-5 font-display text-[18px]" style={{ fontWeight: 600 }}>Obrada</h2>
            <OrderStatusForm
              id={order.id}
              status={order.status}
              internalNote={order.internal_note}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
