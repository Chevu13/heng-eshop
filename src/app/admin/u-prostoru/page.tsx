import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { adminHomepage, adminInSpace } from '@/lib/admin/queries';
import { SectionEditor } from '@/components/admin/SectionEditor';
import { AdminHeading } from '@/components/admin/AdminUI';
import { ArticlesPanel } from '@/components/admin/ArticlesPanel';

export const metadata: Metadata = { title: 'U prostoru' };
export const dynamic = 'force-dynamic';

export default async function AdminInSpacePage() {
  await requireAdmin();
  const [{ articles }, sections] = await Promise.all([adminInSpace(), adminHomepage()]);
  const banner = sections.find((s) => s.key === 'inspace_banner');

  return (
    <>
      <AdminHeading
        title="U prostoru"
        description="Baner na vrhu strane i članci (inspiracija, saveti, materijali)."
        action={<Link href="/u-prostoru" target="_blank" className="btn btn-outline">Pogledaj stranu</Link>}
      />
      <div className="space-y-8">
        {banner && (
          <ul><SectionEditor section={banner} label="Baner na vrhu strane" /></ul>
        )}
        <ArticlesPanel articles={articles} />
      </div>
    </>
  );
}
