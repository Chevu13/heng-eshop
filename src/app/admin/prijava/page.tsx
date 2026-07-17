import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminSetupNotice } from '@/components/admin/AdminSetupNotice';
import { isSupabaseConfigured } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Prijava — Admin',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  if (!isSupabaseConfigured) return <AdminSetupNotice />;
  return <LoginForm />;
}
