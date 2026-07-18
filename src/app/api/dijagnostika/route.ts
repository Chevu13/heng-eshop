import { NextResponse } from 'next/server';
import { createPublicSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Dijagnostika povezanosti sa bazom.
 * Otvoriti: /api/dijagnostika  — pokazuje tačno gde katalog puca,
 * bez otkrivanja tajnih vrednosti. Bezbedno je ostaviti u produkciji:
 * ne vraća podatke, samo brojače i poruke grešaka.
 */
export async function GET() {
  const report: Record<string, unknown> = {
    supabase_konfigurisan: isSupabaseConfigured,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'postavljeno ✓' : 'NEDOSTAJE ✗',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'postavljeno ✓' : 'NEDOSTAJE ✗',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'postavljeno ✓' : 'NEDOSTAJE ✗ (potrebno za porudžbine/upite)',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'NEDOSTAJE (koristi se localhost)',
    },
  };

  if (!isSupabaseConfigured) {
    report.zakljucak =
      'Supabase nije konfigurisan — sajt radi u demo režimu. Dodajte NEXT_PUBLIC_SUPABASE_URL i ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY u Vercel → Settings → Environment Variables, pa Redeploy.';
    return NextResponse.json(report, { status: 200 });
  }

  const sb = createPublicSupabase();
  if (!sb) {
    report.zakljucak = 'Klijent nije kreiran iako su ključevi prisutni.';
    return NextResponse.json(report, { status: 500 });
  }

  // Isti upit kao katalog — kao anonimni korisnik (poštuje RLS).
  const tabele: Record<string, unknown> = {};
  for (const [naziv, upit] of [
    ['products (objavljeni)', sb.from('products').select('id', { count: 'exact', head: true }).eq('is_published', true).eq('is_archived', false)],
    ['categories (objavljene)', sb.from('categories').select('id', { count: 'exact', head: true }).eq('is_published', true)],
    ['product_variants', sb.from('product_variants').select('id', { count: 'exact', head: true })],
    ['product_media', sb.from('product_media').select('id', { count: 'exact', head: true })],
    ['homepage_sections', sb.from('homepage_sections').select('id', { count: 'exact', head: true })],
    ['site_settings', sb.from('site_settings').select('id', { count: 'exact', head: true })],
  ] as const) {
    const { count, error } = await upit;
    tabele[naziv] = error
      ? { greska: error.message, kod: error.code, savet: error.hint ?? undefined }
      : { broj_redova: count ?? 0 };
  }
  report.tabele = tabele;

  // Zaključak
  const productsResult = tabele['products (objavljeni)'] as { greska?: string; kod?: string; broj_redova?: number };
  if (productsResult.greska) {
    if (productsResult.kod === '42P01') {
      report.zakljucak = 'Tabela „products” ne postoji — migracije nisu pokrenute. Pustite 0001, 0002, 0003 redom.';
    } else if (productsResult.kod === '42501' || /permission|policy|RLS/i.test(productsResult.greska)) {
      report.zakljucak = 'Baza odbija čitanje (RLS/dozvole) — proverite da je migracija 0002_rls.sql prošla u celosti.';
    } else if (/JWT|apikey|Invalid|key/i.test(productsResult.greska)) {
      report.zakljucak = 'Pogrešan anon ključ — proverite NEXT_PUBLIC_SUPABASE_ANON_KEY (Supabase → Settings → API → anon public).';
    } else {
      report.zakljucak = `Upit ka bazi puca: ${productsResult.greska}`;
    }
  } else if ((productsResult.broj_redova ?? 0) === 0) {
    report.zakljucak =
      'Veza radi, ali nema objavljenih proizvoda. Pustite heng-seed.sql u Supabase SQL Editor. ' +
      'Ako ste ga već pustili, proverite da su proizvodi is_published = true.';
  } else {
    report.zakljucak =
      `Sve u redu — vidljivo ${productsResult.broj_redova} proizvoda. Ako sajt i dalje pokazuje prazno, ` +
      'katalog je keširan (revalidate 300s): sačekajte 5 min ili uradite Redeploy.';
  }

  return NextResponse.json(report, { status: 200 });
}
