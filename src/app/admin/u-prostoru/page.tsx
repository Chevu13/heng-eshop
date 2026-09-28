import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { adminInSpace } from '@/lib/admin/queries';
import { AdminHeading } from '@/components/admin/AdminUI';
import { ArticlesPanel } from '@/components/admin/ArticlesPanel';

export const metadata: Metadata = { title: 'U prostoru' };
export const dynamic = 'force-dynamic';

export default async function AdminInSpacePage() {
  await requireAdmin();
  const { articles } = await adminInSpace();

  return (
    <>
      <AdminHeading
        title="U prostoru"
        description="Članci (inspiracija, saveti, materijali) na strani „U prostoru”."
        action={<Link href="/u-prostoru" target="_blank" className="btn btn-outline">Pogledaj stranu</Link>}
      />
      <div className="space-y-8">
        <ArticlesPanel articles={articles} />
      </div>
    </>
  );
}
