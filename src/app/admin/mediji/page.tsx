import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase/server';
import { AdminHeading } from '@/components/admin/AdminUI';
import { MediaLibrary, type MediaFile } from '@/components/admin/MediaLibrary';
import { ASSET_MANIFEST } from '@/lib/data/asset-manifest';

export const metadata: Metadata = { title: 'Mediji' };
export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  await requireAdmin();
  const sb = createServerSupabase();

  let files: MediaFile[] = [];
  let error: string | null = null;

  if (sb) {
    const { data, error: listError } = await sb.storage
      .from('heng-media')
      .list('katalog', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

    if (listError) {
      error =
        'Bucket „heng-media” nije dostupan. Proverite da li je migracija 0003_storage.sql primenjena.';
    } else {
      files = (data ?? [])
        .filter((f) => f.id)
        .map((f) => ({
          path: `katalog/${f.name}`,
          name: f.name,
          size: (f.metadata?.size as number) ?? 0,
          type: (f.metadata?.mimetype as string) ?? '',
        }));
    }
  }

  const local = ASSET_MANIFEST.map((a) => ({
    path: a.path, alt: a.alt, group: a.group, original: a.original,
  }));

  return (
    <>
      <AdminHeading
        title="Mediji"
        description="Otpremljeni fajlovi u Supabase Storage-u i lokalni brend materijal isporučen uz projekat."
      />
      <MediaLibrary files={files} error={error} local={local} />
    </>
  );
}
