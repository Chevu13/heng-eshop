import { SUPABASE_URL } from '@/lib/env';

/** Javna adresa fajla iz `heng-media` bucket-a. */
export function publicMediaUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/heng-media/${path}`;
}

/** Prihvata i lokalnu putanju (/assets/...) i Storage putanju. */
export function resolveMediaUrl(value: string): string {
  if (value.startsWith('/') || value.startsWith('http')) return value;
  return publicMediaUrl(value);
}
