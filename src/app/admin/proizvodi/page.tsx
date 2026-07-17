import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { adminProducts } from '@/lib/admin/queries';
import { AdminHeading, Badge, TableEmpty } from '@/components/admin/AdminUI';
import { ProductRowActions } from '@/components/admin/ProductRowActions';
import { formatRsd, CENA_NA_UPIT } from '@/lib/format';
import { resolveMediaUrl } from '@/lib/admin/media';

export const metadata: Metadata = { title: 'Proizvodi' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await adminProducts();

  return (
    <>
      <AdminHeading
        title="Proizvodi"
        description="Katalog, varijante obrada, cene, zalihe i vidljivost na sajtu."
        action={<Link href="/admin/proizvodi/novi" className="btn btn-primary">Novi proizvod</Link>}
      />

      {products.length === 0 ? (
        <TableEmpty
          title="Katalog je prazan"
          description="Dodajte prvi proizvod ili pokrenite `npm run seed` da biste uneli početnu kolekciju."
        />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-ink/12 bg-white/60">
          <table className="w-full min-w-[860px] border-collapse">
            <caption className="sr-only">Lista proizvoda u katalogu</caption>
            <thead>
              <tr className="border-b border-ink/12 text-left">
                {['Proizvod', 'Kategorija', 'Cena', 'Zaliha', 'Obrade', 'Status', ''].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-body text-[11px] uppercase tracking-eyebrow text-ink/45">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const cover = p.media?.find((m) => m.is_cover) ?? p.media?.[0];
                const totalStock = p.variants?.length
                  ? p.variants.reduce((s, v) => s + v.stock, 0)
                  : p.stock;
                return (
                  <tr key={p.id} className="border-b border-ink/8 last:border-0 align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-ivory">
                          {cover && (
                            <Image
                              src={resolveMediaUrl(cover.url)} alt=""
                              fill sizes="40px" className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/admin/proizvodi/${p.id}`} className="link-gold font-body text-[14px]">
                            {p.name}
                          </Link>
                          <p className="truncate font-body text-[11px] text-ink/40">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-[13px] text-ink/60">
                      {p.category?.title ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-body text-[13px] tabular-nums">
                      {p.price_on_request || p.price_rsd === null
                        ? <span className="text-ink/50">{CENA_NA_UPIT}</span>
                        : formatRsd(Number(p.price_rsd))}
                    </td>
                    <td className="px-4 py-3 font-body text-[13px] tabular-nums text-ink/60">{totalStock}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {(p.variants ?? []).filter((v) => v.is_active).map((v) => (
                          <span
                            key={v.id} title={v.finish_name}
                            className="block h-3 w-3 rounded-sm ring-1 ring-inset ring-ink/15"
                            style={{ background: v.finish_swatch ?? '#8C8477' }}
                          />
                        ))}
                        {!p.variants?.length && <span className="font-body text-[12px] text-ink/35">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {p.is_archived
                          ? <Badge tone="muted">Arhiviran</Badge>
                          : p.is_published
                            ? <Badge tone="neutral">Objavljen</Badge>
                            : <Badge tone="muted">Nacrt</Badge>}
                        {p.is_featured && <Badge tone="gold">Izdvojen</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ProductRowActions
                        id={p.id}
                        isPublished={p.is_published}
                        isFeatured={p.is_featured}
                        isArchived={p.is_archived}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
