import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

export interface AdminSession {
  id: string;
  email: string;
  fullName: string | null;
}

/**
 * Vraća sesiju samo ako korisnik ima ulogu 'admin' u tabeli profiles.
 * Uloga se čita sa servera — nikada iz JWT tvrdnji koje klijent može menjati.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const sb = createServerSupabase();
  if (!sb) return null;

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile } = await sb
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') return null;
  return { id: profile.id, email: profile.email, fullName: profile.full_name };
}

export async function requireAdmin(): Promise<AdminSession> {
  if (!isSupabaseConfigured) redirect('/admin');
  const session = await getAdminSession();
  if (!session) redirect('/admin/prijava');
  return session;
}
