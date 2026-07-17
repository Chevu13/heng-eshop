/**
 * Konfiguracija okruženja.
 * Aplikacija radi i bez Supabase kredencijala — tada se katalog čita iz
 * lokalnog seed sloja (read-only demo), a admin panel prikazuje jasno
 * uputstvo za povezivanje baze. Nijedan privilegovani ključ ne završava
 * u klijentskom bundle-u.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function serviceRoleKey(): string | null {
  if (typeof window !== 'undefined') return null; // nikad u browseru
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const isEmailConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD,
);
