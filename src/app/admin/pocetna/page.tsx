import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { adminHomepage } from '@/lib/admin/queries';
import { AdminHeading, TableEmpty } from '@/components/admin/AdminUI';
import { SectionEditor } from '@/components/admin/SectionEditor';

export const metadata: Metadata = { title: 'Početna strana' };
export const dynamic = 'force-dynamic';

/**
 * Početna strana ima tačno četiri sekcije. Galerija i članci strane
 * /u-prostoru uređuju se na /admin/u-prostoru. Ostali stari redovi se ne prikazuju.
 */
const LABELS: Record<string, string> = {
  hero: 'Hero sekcija',
  categories: '01 — Kategorije',
  material: '02 — Držači za vino i čaše',
  handles: '03 — Ručke od prirodnog kamena',
};

export default async function AdminHomepagePage() {
  await requireAdmin();
  const sections = (await adminHomepage()).filter((s) => s.key in LABELS);

  return (
    <>
      <AdminHeading
        title="Početna strana"
        description="Tekstovi, medij, vidljivost i redosled sekcija. Svaka sekcija ima sopstvena polja u JSON obliku."
        action={<Link href="/" target="_blank" className="btn btn-outline">Pogledaj sajt</Link>}
      />

      {sections.length === 0 ? (
        <TableEmpty
          title="Sekcije nisu unete"
          description="Pokrenite `npm run seed` da biste uneli početni sadržaj strane."
        />
      ) : (
        <ul className="space-y-4">
          {sections.map((s) => (
            <SectionEditor key={s.id} section={s} label={LABELS[s.key] ?? s.key} />
          ))}
        </ul>
      )}
    </>
  );
}
