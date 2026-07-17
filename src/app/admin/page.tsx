import Link from 'next/link';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { adminDashboard } from '@/lib/admin/queries';
import { AdminHeading, Badge, Stat, TableEmpty } from '@/components/admin/AdminUI';
import { formatRsd, formatDate, statusLabel } from '@/lib/format';

export const metadata: Metadata = { title: 'Pregled' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await requireAdmin();
  const d = await adminDashboard();

  return (
    <>
      <AdminHeading
        title="Pregled"
        description="Stanje kataloga, porudžbina i upita na jednom mestu."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Aktivni proizvodi" value={d.activeProducts} href="/admin/proizvodi" />
        <Stat label="Kategorije" value={d.categories} href="/admin/kategorije" />
        <Stat
          label="Porudžbine na čekanju"
          value={d.pendingOrders}
          href="/admin/porudzbine?status=nova"
          tone={d.pendingOrders > 0 ? 'alert' : 'default'}
        />
        <Stat label="Vrednost porudžbina" value={formatRsd(d.totalValue)} href="/admin/porudzbine" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[19px]" style={{ fontWeight: 600 }}>Poslednje porudžbine</h2>
            <Link href="/admin/porudzbine" className="link-gold font-body text-[12px] uppercase tracking-eyebrow">
              Sve
            </Link>
          </div>
          {d.recentOrders.length === 0 ? (
            <TableEmpty title="Još nema porudžbina" description="Nove porudžbine sa sajta pojaviće se ovde." />
          ) : (
            <ul className="rounded-sm border border-ink/12 bg-white/60">
              {d.recentOrders.map((o) => (
                <li key={o.id} className="border-b border-ink/8 last:border-0">
                  <Link href={`/admin/porudzbine/${o.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-ivory/50">
                    <div className="min-w-0">
                      <p className="font-body text-[14px] tabular-nums">{o.reference}</p>
                      <p className="truncate font-body text-[12px] text-ink/50">
                        {o.full_name} · {formatDate(o.created_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-body text-[13px] tabular-nums">{formatRsd(Number(o.total_rsd))}</span>
                      <Badge tone={o.status === 'nova' ? 'magenta' : 'muted'}>{statusLabel(o.status)}</Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[19px]" style={{ fontWeight: 600 }}>Poslednji upiti</h2>
            <Link href="/admin/upiti" className="link-gold font-body text-[12px] uppercase tracking-eyebrow">
              Svi
            </Link>
          </div>
          {d.recentInquiries.length === 0 ? (
            <TableEmpty title="Još nema upita" description="Projektni upiti sa sajta pojaviće se ovde." />
          ) : (
            <ul className="rounded-sm border border-ink/12 bg-white/60">
              {d.recentInquiries.map((q) => (
                <li key={q.id} className="border-b border-ink/8 p-4 last:border-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-body text-[14px]">{q.full_name}</p>
                      <p className="truncate font-body text-[12px] text-ink/50">
                        {q.company ? `${q.company} · ` : ''}{formatDate(q.created_at)}
                      </p>
                    </div>
                    <Badge tone={q.status === 'nov' ? 'gold' : 'muted'}>{statusLabel(q.status)}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-[19px]" style={{ fontWeight: 600 }}>Niske zalihe</h2>
        {d.lowStock.length === 0 ? (
          <TableEmpty
            title="Nema upozorenja o zalihama"
            description="Ovde se prikazuju varijante sa 3 ili manje komada na stanju."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.lowStock.map((v) => (
              <li key={v.id} className="flex items-center justify-between rounded-sm border border-ink/12 bg-white/60 p-4">
                <div>
                  <p className="font-body text-[14px]">{v.name}</p>
                  <p className="font-body text-[12px] text-ink/50">{v.finish}</p>
                </div>
                <Badge tone={v.stock === 0 ? 'magenta' : 'gold'}>{v.stock} kom.</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
