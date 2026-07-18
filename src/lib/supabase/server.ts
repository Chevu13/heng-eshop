import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured, serviceRoleKey } from '@/lib/env';

/**
 * Klijent za javni katalog — bez kolačića i bez sesije.
 * Koristi se za sve javne čitanje-operacije (katalog, podešavanja, sekcije),
 * pa se sme pozvati i van zahteva: iz `generateStaticParams`, `sitemap` i
 * build-a. RLS ostaje aktivan jer se koristi anon ključ.
 */
export function createPublicSupabase() {
  if (!isSupabaseConfigured) return null;
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Klijent vezan za sesiju korisnika (poštuje RLS).
 * Poziva `cookies()` — sme isključivo unutar zahteva (Server Component,
 * Server Action, Route Handler). Nikada iz `generateStaticParams`.
 */
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
