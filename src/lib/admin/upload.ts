'use client';

import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/format';
import { mediaType } from '@/lib/validation';
import { publicMediaUrl } from './media';

const MAX_SIDE = 2400;
const QUALITY = 0.86;

/**
 * Fotografija se pre slanja smanjuje u pregledaču (najduža strana 2400 px)
 * i pretvara u WebP (JPEG ako pregledač ne ume WebP). Sajt preko next/image
 * od nje sam pravi manje verzije za telefon, AVIF i WebP.
 * GIF i video idu neizmenjeni.
 */
async function prepare(file: File, type: string): Promise<{ blob: Blob; type: string; ext: string }> {
  const raw = { blob: file as Blob, type, ext: file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin' };
  if (!type.startsWith('image/') || type === 'image/gif') return raw;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const toBlob = (t: string) => new Promise<Blob | null>((r) => canvas.toBlob(r, t, QUALITY));
    const webp = await toBlob('image/webp');
    if (webp && webp.type === 'image/webp') return { blob: webp, type: 'image/webp', ext: 'webp' };
    const jpeg = await toBlob('image/jpeg');
    return jpeg ? { blob: jpeg, type: 'image/jpeg', ext: 'jpg' } : raw;
  } catch {
    return raw; // pregledač ne ume da otvori format — šalje se original
  }
}

/** Otprema fajl u `heng-media/katalog` i vraća javnu adresu. Baca grešku sa porukom za korisnika. */
export async function uploadMediaFile(file: File): Promise<string> {
  const type = mediaType(file.name, file.type);
  if (!type) throw new Error(`Format fajla „${file.name}” nije podržan.`);
  if (file.size > 25 * 1024 * 1024) throw new Error(`„${file.name}” je veći od 25 MB.`);
  const sb = createClient();
  if (!sb) throw new Error('Supabase nije podešen.');

  const out = await prepare(file, type);
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'medij';
  const path = `katalog/${base}-${Date.now().toString(36)}.${out.ext}`;
  const { error } = await sb.storage.from('heng-media').upload(path, out.blob, { contentType: out.type, upsert: false });
  if (error) throw new Error(`Otpremanje „${file.name}” nije uspelo: ${error.message}`);
  return publicMediaUrl(path);
}
