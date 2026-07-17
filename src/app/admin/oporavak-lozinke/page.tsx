import type { Metadata } from 'next';
import { PasswordRecoveryForm } from '@/components/admin/PasswordRecoveryForm';
import { AdminSetupNotice } from '@/components/admin/AdminSetupNotice';
import { isSupabaseConfigured } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Oporavak lozinke — Admin',
  robots: { index: false, follow: false },
};

export default function RecoveryPage() {
  if (!isSupabaseConfigured) return <AdminSetupNotice />;
  return <PasswordRecoveryForm />;
}
