/**
 * Konfiguracija okruženja.
 * Aplikacija radi i bez Supabase kredencijala — tada se katalog čita iz
 * lokalnog seed sloja (read-only demo), a admin panel prikazuje jasno
 * uputstvo za povezivanje baze. Nijedan privilegovani ključ ne završava
 * u klijentskom bundle-u.
 */
/**
 * Supabase URL se normalizuje na čist origin (protokol + host).
 * Ljudi često nalepe URL sa `/rest/v1` na kraju (kopiran iz API Docs) ili sa
 * kosom crtom — supabase-js tada gradi dupliranu putanju
 * (`/rest/v1/rest/v1/...`) i PostgREST vraća PGRST125 „Invalid path”.
 * Zadržavanjem samo origin-a aplikacija radi bez obzira na to šta je nalepljeno.
 */
function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw) return '';
  try {
    return new URL(raw.trim()).origin;
  } catch {
    return '';
  }
}

export const SUPABASE_URL = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_URL_RAW = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
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
