import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { adminOrders } from '@/lib/admin/queries';
import { AdminHeading, Badge, TableEmpty } from '@/components/admin/AdminUI';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { formatRsd, formatDate, statusLabel } from '@/lib/format';

export const metadata: Metadata = { title: 'Porudžbine' };
export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: { searchParams: { status?: string; q?: string } }) {
  await requireAdmin();
  const orders = await adminOrders({ status: searchParams.status, q: searchParams.q });
  const filtered = Boolean(searchParams.status || searchParams.q);

  return (
    <>
      <AdminHeading
        title="Porudžbine"
        description="Pregled, pretraga i promena statusa porudžbina pristiglih sa sajta."
      />

      <OrderFilters />

      {orders.length === 0 ? (
        <div className="mt-8">
          <TableEmpty
            title={filtered ? 'Nema rezultata' : 'Još nema porudžbina'}
            description={
              filtered
                ? 'Promenite status ili pojam pretrage.'
                : 'Nove porudžbine sa sajta pojaviće se ovde automatski.'
            }
          />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-sm border border-ink/12 bg-white/60">
          <table className="w-full min-w-[780px] border-collapse">
            <caption className="sr-only">Lista porudžbina</caption>
            <thead>
              <tr className="border-b border-ink/12 text-left">
                {['Broj', 'Kupac', 'Datum', 'Stavke', 'Ukupno', 'Status'].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-body text-[11px] uppercase tracking-eyebrow text-ink/45">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/8 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/porudzbine/${o.id}`} className="link-gold font-body text-[14px] tabular-nums">
                      {o.reference}
                    </Link>
                    {o.has_request_items && (
                      <span className="ml-2"><Badge tone="gold">Na upit</Badge></span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-[14px]">{o.full_name}</p>
                    <p className="font-body text-[12px] text-ink/45">{o.city}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-[13px] tabular-nums text-ink/60">
                    {formatDate(o.created_at)}
                  </td>
                  <td className="px-4 py-3 font-body text-[13px] tabular-nums text-ink/60">
                    {o.items?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 font-body text-[13px] tabular-nums">
                    {formatRsd(Number(o.total_rsd))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={o.status === 'nova' ? 'magenta' : o.status === 'zavrsena' ? 'neutral' : 'muted'}>
                      {statusLabel(o.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
