import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured, serviceRoleKey } from '@/lib/env';

/** Klijent vezan za sesiju korisnika (poštuje RLS). */
export function createServerSupabase() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list: { name: string; value: string; options?: CookieOptions }[]) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Poziv iz Server Component-a — osvežavanje obavlja middleware.
        }
      },
    },
  });
}

/**
 * Privilegovani klijent — isključivo za server rute (kreiranje porudžbina,
 * upita, upload priloga). Nikada se ne uvozi u klijentske komponente.
 */
export function createAdminSupabase() {
  const key = serviceRoleKey();
  if (!isSupabaseConfigured || !key) return null;
  return createSupabaseClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
