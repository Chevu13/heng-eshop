import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { adminHomepage } from '@/lib/admin/queries';
import { SectionEditor } from '@/components/admin/SectionEditor';
import { AdminHeading } from '@/components/admin/AdminUI';

export const metadata: Metadata = { title: 'O nama' };
export const dynamic = 'force-dynamic';

export default async function AdminAboutPage() {
  await requireAdmin();
  const about = (await adminHomepage()).find((s) => s.key === 'about');

  return (
    <>
      <AdminHeading
        title="O nama"
        description="Tekstovi i fotografije strane O nama."
        action={<Link href="/o-nama" target="_blank" className="btn btn-outline">Pogledaj stranu</Link>}
      />
      {about && <ul><SectionEditor section={about} label="Strana O nama" /></ul>}
    </>
  );
}
