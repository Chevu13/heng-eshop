import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { adminSettings } from '@/lib/admin/queries';
import { AdminHeading } from '@/components/admin/AdminUI';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const metadata: Metadata = { title: 'Podešavanja' };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const settings = await adminSettings();

  return (
    <>
      <AdminHeading
        title="Podešavanja"
        description="Kontakt podaci, dostava, načini plaćanja, podrazumevani SEO i tekst pravnih strana."
      />
      <SettingsForm settings={settings} adminEmail={session.email} />
    </>
  );
}
