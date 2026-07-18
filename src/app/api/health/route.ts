import { NextResponse } from 'next/server';
import { createPublicSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured, isEmailConfigured } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Dijagnostika povezanosti sa bazom. Otvoriti /api/health u pregledaču.
 * Ne otkriva tajne — samo da li su podešene i da li upiti prolaze kroz RLS.
 * Kada je sve zeleno a katalog i dalje prazan, problem je u sadržaju (seed),
 * ne u vezi.
 */
export async function GET() {
  const checks: Record<string, unknown> = {
    supabase_konfigurisan: isSupabaseConfigured,
    email_konfigurisan: isEmailConfigured,
    ima_service_role_kljuc: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    site_url: process.env.NEXT_PUBLIC_SITE_URL ?? '(nije postavljen)',
  };

  if (!isSupabaseConfigured) {
    return NextResponse.json({
      status: 'DEMO',
      poruka:
        'Supabase nije povezan. Sajt radi u demo režimu iz lokalnog seed-a. ' +
        'Dodajte NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      checks,
    });
  }

  const pub = createPublicSupabase();
  const tables = ['categories', 'products', 'product_variants', 'product_media', 'homepage_sections'];
  const brojanje: Record<string, number | string> = {};
  let prviProblem: string | null = null;

  for (const t of tables) {
    const { count, error } = await pub!.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      brojanje[t] = `GREŠKA: ${error.message}`;
      prviProblem ??= `${t}: ${error.message} (kod ${error.code ?? '—'})`;
    } else {
      brojanje[t] = count ?? 0;
    }
  }

  const { count: vidljivi, error: vidError } = await pub!
    .from('products').select('*', { count: 'exact', head: true })
    .eq('is_published', true).eq('is_archived', false);

  const adminOk = Boolean(createAdminSupabase());

  let status = 'OK';
  let poruka = 'Baza je povezana i katalog je vidljiv.';

  if (prviProblem) {
    status = 'GRESKA_UPITA';
    poruka =
      'Upit ka bazi ne prolazi. Najčešće: migracija 0002_rls.sql nije primenjena, ' +
      'ili je pogrešan anon ključ. Detalj: ' + prviProblem;
  } else if ((brojanje.products as number) === 0) {
    status = 'PRAZNA_BAZA';
    poruka = 'Veza radi, ali nema proizvoda. Pokrenite seed (heng-seed.sql u SQL Editor-u).';
  } else if ((vidError ? 0 : vidljivi ?? 0) === 0) {
    status = 'NISU_OBJAVLJENI';
    poruka =
      'Proizvodi postoje ali nijedan nije objavljen. U /admin/proizvodi uključite „Objavljen”, ' +
      'ili ponovo pokrenite seed.';
  }

  return NextResponse.json({
    status,
    poruka,
    checks: { ...checks, admin_klijent_dostupan: adminOk },
    brojanje_kroz_anon_kljuc: brojanje,
    vidljivih_proizvoda_na_sajtu: vidError ? `GREŠKA: ${vidError.message}` : vidljivi ?? 0,
  });
}
