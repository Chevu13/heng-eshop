import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/env';
import { createPublicSupabase } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Dijagnostika povezanosti sa bazom.
 * Otvoriti /api/status na sajtu — pokazuje da li aplikacija vidi Supabase,
 * da li anon ključ može da čita objavljen katalog i koliko redova vraća.
 * Ne otkriva ključeve niti podatke kupaca; bezbedno je za privremenu proveru.
 */
export async function GET() {
  const report: Record<string, unknown> = {
    vreme: new Date().toISOString(),
    supabase_konfigurisan: isSupabaseConfigured,
    site_url: process.env.NEXT_PUBLIC_SITE_URL ?? '(nije postavljen)',
  };

  if (!isSupabaseConfigured) {
    report.rezim = 'DEMO — nema NEXT_PUBLIC_SUPABASE_URL / ANON_KEY. Katalog se čita iz lokalnog seed-a.';
    return NextResponse.json(report, { status: 200 });
  }

  report.rezim = 'BAZA — čita se Supabase preko anon ključa (RLS aktivan).';

  const sb = createPublicSupabase();
  if (!sb) {
    report.greska = 'Klijent nije napravljen iako su ključevi prisutni.';
    return NextResponse.json(report, { status: 500 });
  }

  // Isti upit koji radi stranica /kolekcija.
  const tables: Record<string, unknown> = {};
  for (const [naziv, upit] of [
    ['proizvodi_objavljeni', sb.from('products').select('id', { count: 'exact', head: true }).eq('is_published', true).eq('is_archived', false)],
    ['proizvodi_svi', sb.from('products').select('id', { count: 'exact', head: true })],
    ['kategorije', sb.from('categories').select('id', { count: 'exact', head: true }).eq('is_published', true)],
    ['varijante', sb.from('product_variants').select('id', { count: 'exact', head: true })],
    ['mediji', sb.from('product_media').select('id', { count: 'exact', head: true })],
    ['sekcije_pocetne', sb.from('homepage_sections').select('id', { count: 'exact', head: true })],
  ] as const) {
    const { count, error } = await upit;
    tables[naziv] = error
      ? { greska: error.message, kod: error.code ?? null, savet: error.hint ?? null }
      : (count ?? 0);
  }
  report.tabele = tables;

  // Zaključak u ljudskom obliku.
  const objavljeni = tables.proizvodi_objavljeni;
  const svi = tables.proizvodi_svi;
  if (typeof objavljeni === 'object') {
    report.zakljucak =
      'Upit ka `products` je PAO. Najčešće: migracije/RLS nisu primenjeni ili je pogrešan anon ključ. Vidi polje tabele.proizvodi_objavljeni.';
  } else if (objavljeni === 0 && svi === 0) {
    report.zakljucak = 'Baza je prazna — pokrenite seed (heng-seed.sql u SQL Editor-u).';
  } else if (objavljeni === 0 && typeof svi === 'number' && svi > 0) {
    report.zakljucak = `Postoji ${svi} proizvoda, ali nijedan nije objavljen (is_published = false). Objavite ih u /admin ili re-run seed.`;
  } else {
    report.zakljucak = `Sve u redu — ${objavljeni} objavljenih proizvoda vidljivo je javnosti. Ako sajt i dalje prazan: keš (sačekati 5 min ili Redeploy).`;
  }

  return NextResponse.json(report, { status: 200 });
}
