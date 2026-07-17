/**
 * HENG — seed skripta
 * Unosi početne kategorije, proizvode, varijante obrada, galerije,
 * sekcije početne strane i podešavanja sajta.
 *
 * Pokretanje:  npm run seed
 * Zahteva:     NEXT_PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY
 *
 * Skripta je idempotentna: ponovno pokretanje ažurira postojeće zapise
 * prema slug/key ključu i ne pravi duplikate.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CATEGORIES, HOMEPAGE_SECTIONS, PRODUCTS, SITE_SETTINGS,
} from '../../src/lib/data/fixtures';

// --- učitavanje .env.local bez dodatnih zavisnosti ---
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), 'utf8');
      for (const line of content.split('\n')) {
        const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
        if (!match) continue;
        const [, key, rawValue] = match;
        if (process.env[key]) continue;
        process.env[key] = rawValue.replace(/^["']|["']$/g, '');
      }
    } catch {
      // fajl ne postoji — nastavlja se sa promenljivama iz okruženja
    }
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    '\n✗ Nedostaju kredencijali.\n' +
    '  Postavite NEXT_PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY u .env.local\n',
  );
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const log = (msg: string) => console.log(`  ${msg}`);

async function seed() {
  console.log('\nHENG — unos početnog sadržaja\n');

  // ---------- Kategorije ----------
  const categoryIds = new Map<string, string>();
  for (const c of CATEGORIES) {
    const { data, error } = await sb
      .from('categories')
      .upsert(
        {
          slug: c.slug,
          title: c.title,
          description: c.description,
          cover_image: c.cover_image,
          sort_order: c.sort_order,
          is_published: c.is_published,
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single();
    if (error) throw new Error(`Kategorija „${c.title}”: ${error.message}`);
    categoryIds.set(c.id, data.id);
  }
  log(`✓ Kategorije: ${CATEGORIES.length}`);

  // ---------- Proizvodi + varijante + mediji ----------
  for (const p of PRODUCTS) {
    const { data: product, error } = await sb
      .from('products')
      .upsert(
        {
          slug: p.slug,
          name: p.name,
          category_id: p.category_id ? categoryIds.get(p.category_id) ?? null : null,
          short_description: p.short_description,
          description: p.description,
          technical_info: p.technical_info,
          installation_info: p.installation_info,
          delivery_info: p.delivery_info,
          material: p.material,
          dimensions: p.dimensions,
          sku: p.sku,
          price_rsd: p.price_rsd,
          sale_price_rsd: p.sale_price_rsd,
          price_on_request: p.price_on_request,
          stock: p.stock,
          tags: p.tags,
          is_featured: p.is_featured,
          is_published: p.is_published,
          is_archived: p.is_archived,
          sort_order: p.sort_order,
          seo_title: p.seo_title,
          seo_description: p.seo_description,
          og_image: p.og_image,
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single();
    if (error) throw new Error(`Proizvod „${p.name}”: ${error.message}`);

    const variantIds = new Map<string, string>();
    for (const v of p.variants) {
      const { data: variant, error: vError } = await sb
        .from('product_variants')
        .upsert(
          {
            product_id: product.id,
            finish_name: v.finish_name,
            finish_code: v.finish_code,
            finish_swatch: v.finish_swatch,
            sku: v.sku,
            price_rsd: v.price_rsd,
            sale_price_rsd: v.sale_price_rsd,
            stock: v.stock,
            dimensions: v.dimensions,
            main_image: v.main_image,
            gallery: v.gallery,
            is_active: v.is_active,
            sort_order: v.sort_order,
          },
          { onConflict: 'product_id,finish_code' },
        )
        .select('id')
        .single();
      if (vError) throw new Error(`Varijanta „${v.finish_name}”: ${vError.message}`);
      variantIds.set(v.id, variant.id);
    }

    // Galerija se svaki put postavlja iznova — jedini pouzdan način da
    // redosled i naslovna fotografija ostanu tačni bez duplikata.
    await sb.from('product_media').delete().eq('product_id', product.id);
    const { error: mError } = await sb.from('product_media').insert(
      p.media.map((m) => ({
        product_id: product.id,
        variant_id: m.variant_id ? variantIds.get(m.variant_id) ?? null : null,
        url: m.url,
        kind: m.kind,
        poster_url: m.poster_url,
        alt: m.alt,
        is_cover: m.is_cover,
        sort_order: m.sort_order,
      })),
    );
    if (mError) throw new Error(`Galerija „${p.name}”: ${mError.message}`);

    log(`✓ ${p.name} — ${p.variants.length} obrada, ${p.media.length} fotografija`);
  }

  // ---------- Sekcije početne strane ----------
  for (const s of HOMEPAGE_SECTIONS) {
    const { error } = await sb.from('homepage_sections').upsert(
      {
        key: s.key,
        title: s.title,
        is_visible: s.is_visible,
        sort_order: s.sort_order,
        content: s.content,
      },
      { onConflict: 'key' },
    );
    if (error) throw new Error(`Sekcija „${s.key}”: ${error.message}`);
  }
  log(`✓ Sekcije početne strane: ${HOMEPAGE_SECTIONS.length}`);

  // ---------- Podešavanja ----------
  const { error: settingsError } = await sb
    .from('site_settings')
    .upsert({ id: 1, ...SITE_SETTINGS }, { onConflict: 'id' });
  if (settingsError) throw new Error(`Podešavanja: ${settingsError.message}`);
  log('✓ Podešavanja sajta');

  console.log(
    '\nGotovo.\n\n' +
    'Sledeći korak: registrujte nalog i dodelite mu admin ulogu —\n' +
    "  update profiles set role = 'admin' where email = 'vas@email.rs';\n",
  );
}

seed().catch((err: unknown) => {
  console.error('\n✗ Seed nije uspeo:', err instanceof Error ? err.message : err, '\n');
  process.exit(1);
});
