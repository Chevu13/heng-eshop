import type { Metadata } from 'next';
import { isSupabaseConfigured } from '@/lib/env';
import { getAdminSession } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminSetupNotice } from '@/components/admin/AdminSetupNotice';
import { NoAccess } from '@/components/admin/NoAccess';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | HENG Admin' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return <div style={{ background: 'var(--color-ivory-2)' }}><AdminSetupNotice /></div>;
  }

  const session = await getAdminSession();
  if (session) return <AdminShell session={session}>{children}</AdminShell>;

  // Prijavljen korisnik bez admin uloge ne sme da vidi panel — ali ni da upadne
  // u petlju preusmeravanja ka prijavi.
  const sb = createServerSupabase();
  const { data } = (await sb?.auth.getUser()) ?? { data: { user: null } };
  if (data.user) return <NoAccess />;

  // Nema sesije: prikazuju se strane za prijavu / oporavak lozinke.
  return <>{children}</>;
}
