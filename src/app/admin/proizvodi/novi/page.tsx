import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { adminCategories } from '@/lib/admin/queries';
import { AdminHeading } from '@/components/admin/AdminUI';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = { title: 'Novi proizvod' };
export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await adminCategories();

  return (
    <>
      <AdminHeading
        title="Novi proizvod"
        description="Nakon kreiranja otvara se stranica na kojoj dodajete varijante obrada i medije."
        action={<Link href="/admin/proizvodi" className="btn btn-outline">Nazad</Link>}
      />
      <ProductForm product={null} categories={categories} />
    </>
  );
}
