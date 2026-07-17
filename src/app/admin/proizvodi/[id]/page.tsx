import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { adminCategories, adminProduct } from '@/lib/admin/queries';
import { AdminHeading, Badge } from '@/components/admin/AdminUI';
import { ProductForm } from '@/components/admin/ProductForm';
import { VariantsPanel } from '@/components/admin/VariantsPanel';
import { MediaPanel } from '@/components/admin/MediaPanel';
import { DangerZone } from '@/components/admin/DangerZone';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  await requireAdmin();
  const product = await adminProduct(params.id);
  return { title: product ? `${product.name} — izmena` : 'Proizvod' };
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const [product, categories] = await Promise.all([adminProduct(params.id), adminCategories()]);
  if (!product) notFound();

  const variants = [...(product.variants ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <AdminHeading
        title={product.name}
        description={`/proizvod/${product.slug}`}
        action={
          <div className="flex items-center gap-3">
            <Link href="/admin/proizvodi" className="btn btn-outline">Nazad</Link>
          </div>
        }
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {product.is_archived
          ? <Badge tone="muted">Arhiviran</Badge>
          : product.is_published
            ? <Badge tone="neutral">Objavljen</Badge>
            : <Badge tone="muted">Nacrt</Badge>}
        {product.is_featured && <Badge tone="gold">Izdvojen</Badge>}
        {product.price_on_request && <Badge tone="gold">Cena na upit</Badge>}
      </div>

      <ProductForm product={product} categories={categories} />

      <div className="mt-10 space-y-8">
        <VariantsPanel productId={product.id} variants={variants} />
        <MediaPanel productId={product.id} media={product.media ?? []} variants={variants} />
        <DangerZone productId={product.id} productName={product.name} isArchived={product.is_archived} />
      </div>
    </>
  );
}
