import { NextResponse } from 'next/server';
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_URL_RAW } from '@/lib/env';
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
  // project-ref = poddomen Supabase URL-a (npr. abcd1234 iz abcd1234.supabase.co).
  // Nije tajna; služi da se uporedi na koji projekat je Vercel povezan.
  let projectRef = '(nema)';
  try { projectRef = SUPABASE_URL ? new URL(SUPABASE_URL).hostname.split('.')[0] : '(nema)'; } catch { projectRef = '(neispravan URL)'; }

  // Upozorenje ako izvorni URL sadrži putanju (npr. /rest/v1) — čest uzrok PGRST125.
  let urlUpozorenje: string | null = null;
  try {
    const raw = new URL(SUPABASE_URL_RAW.trim());
    if (raw.pathname !== '/' && raw.pathname !== '') {
      urlUpozorenje =
        `NEXT_PUBLIC_SUPABASE_URL sadrži putanju „${raw.pathname}” — aplikacija ju je automatski uklonila. ` +
        'Ispravite promenljivu na čist oblik: ' + raw.origin;
    }
  } catch { /* prazan ili neispravan — pokriveno gore */ }

  // Otisak anon ključa: prvih/zadnjih par znakova, da se vidi da li je isti
  // ključ kao u Supabase-u — bez otkrivanja celog ključa.
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const anonOtisak = anon
    ? `${anon.slice(0, 6)}…${anon.slice(-4)} (dužina ${anon.length})`
    : '(nema)';

  const report: Record<string, unknown> = {
    vreme: new Date().toISOString(),
    supabase_konfigurisan: isSupabaseConfigured,
    supabase_projekat_ref: projectRef,
    supabase_url_upotrebljen: SUPABASE_URL || '(nema)',
    supabase_url_upozorenje: urlUpozorenje,
    anon_kljuc_otisak: anonOtisak,
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

  // Uzorak: da li getProducts stvarno vraća redove sa varijantama i medijima.
  const { data: sample, error: sampleErr } = await sb
    .from('products')
    .select('name, slug, is_published, price_rsd, variants:product_variants(id), media:product_media(id)')
    .eq('is_published', true).eq('is_archived', false)
    .order('sort_order').limit(3);
  report.uzorak_proizvoda = sampleErr
    ? { greska: sampleErr.message, kod: sampleErr.code ?? null }
    : (sample ?? []).map((p) => ({
        naziv: (p as { name: string }).name,
        cena: (p as { price_rsd: number | null }).price_rsd,
        varijante: ((p as { variants?: unknown[] }).variants ?? []).length,
        mediji: ((p as { media?: unknown[] }).media ?? []).length,
      }));

  // Tačno stanje site_settings (izvor PGRST125 iz logova).
  const { data: st, error: stErr } = await sb
    .from('site_settings').select('id, brand_name').limit(1);
  report.site_settings = stErr
    ? { greska: stErr.message, kod: stErr.code ?? null, savet: stErr.hint ?? null }
    : { redova: (st ?? []).length, sadrzaj: st ?? [] };

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
