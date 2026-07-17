import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { adminCategories, adminProducts } from '@/lib/admin/queries';
import { AdminHeading } from '@/components/admin/AdminUI';
import { CategoriesPanel } from '@/components/admin/CategoriesPanel';

export const metadata: Metadata = { title: 'Kategorije' };
export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const [categories, products] = await Promise.all([adminCategories(), adminProducts()]);

  const counts = new Map<string, number>();
  products.forEach((p) => {
    if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  });

  return (
    <>
      <AdminHeading
        title="Kategorije"
        description="Grupisanje kolekcije, naslovne fotografije i redosled u navigaciji."
      />
      <CategoriesPanel
        categories={categories}
        counts={Object.fromEntries(counts)}
      />
    </>
  );
}
