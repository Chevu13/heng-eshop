/**
 * Generiše `supabase/seed/seed.sql` iz istog izvora kao `npm run seed`.
 * Namenjeno korisnicima koji radije nalepe SQL u Supabase Dashboard
 * nego što pokreću Node skriptu lokalno.
 *
 * Pokretanje:  npx tsx scripts/generate-seed-sql.ts
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CATEGORIES, HOMEPAGE_SECTIONS, PRODUCTS, SITE_SETTINGS,
} from '../src/lib/data/fixtures';

/** Bezbedno navođenje SQL literala — jednostruki navodnici se dupliraju. */
const q = (v: string | null | undefined): string =>
  v === null || v === undefined ? 'NULL' : `'${v.replace(/'/g, "''")}'`;
const n = (v: number | null | undefined): string =>
  v === null || v === undefined ? 'NULL' : String(v);
const b = (v: boolean): string => (v ? 'true' : 'false');
const arr = (v: string[]): string =>
  v.length ? `ARRAY[${v.map(q).join(', ')}]::text[]` : `'{}'::text[]`;
const json = (v: unknown): string => `${q(JSON.stringify(v))}::jsonb`;

const out: string[] = [];
const w = (line = '') => out.push(line);

w('-- =============================================================');
w('-- HENG — početni sadržaj (generisano iz src/lib/data/fixtures.ts)');
w('--');
w('-- Pokrenuti U SUPABASE SQL EDITOR-u, POSLE migracija 0001–0003.');
w('-- Skripta je idempotentna: ponovno pokretanje ažurira postojeće');
w('-- zapise po slug/key ključu i ne pravi duplikate.');
w('-- =============================================================');
w();
w('begin;');
w();

// ---------- Kategorije ----------
w('-- ---------- Kategorije ----------');
for (const c of CATEGORIES) {
  w(`insert into categories (slug, title, description, cover_image, sort_order, is_published)`);
  w(`values (${q(c.slug)}, ${q(c.title)}, ${q(c.description)}, ${q(c.cover_image)}, ${c.sort_order}, ${b(c.is_published)})`);
  w(`on conflict (slug) do update set`);
  w(`  title = excluded.title, description = excluded.description,`);
  w(`  cover_image = excluded.cover_image, sort_order = excluded.sort_order,`);
  w(`  is_published = excluded.is_published;`);
  w();
}

// ---------- Proizvodi ----------
w('-- ---------- Proizvodi, varijante i galerije ----------');
for (const p of PRODUCTS) {
  const catSlug = CATEGORIES.find((c) => c.id === p.category_id)?.slug ?? null;

  w(`-- ${p.name}`);
  w(`insert into products (`);
  w(`  slug, name, category_id, short_description, description, technical_info,`);
  w(`  installation_info, delivery_info, material, dimensions, sku,`);
  w(`  price_rsd, sale_price_rsd, price_on_request, stock, tags,`);
  w(`  is_featured, is_published, is_archived, sort_order,`);
  w(`  seo_title, seo_description, og_image`);
  w(`) values (`);
  w(`  ${q(p.slug)}, ${q(p.name)},`);
  w(`  ${catSlug ? `(select id from categories where slug = ${q(catSlug)})` : 'NULL'},`);
  w(`  ${q(p.short_description)},`);
  w(`  ${q(p.description)},`);
  w(`  ${q(p.technical_info)},`);
  w(`  ${q(p.installation_info)},`);
  w(`  ${q(p.delivery_info)},`);
  w(`  ${q(p.material)}, ${q(p.dimensions)}, ${q(p.sku)},`);
  w(`  ${n(p.price_rsd)}, ${n(p.sale_price_rsd)}, ${b(p.price_on_request)}, ${p.stock}, ${arr(p.tags)},`);
  w(`  ${b(p.is_featured)}, ${b(p.is_published)}, ${b(p.is_archived)}, ${p.sort_order},`);
  w(`  ${q(p.seo_title)}, ${q(p.seo_description)}, ${q(p.og_image)}`);
  w(`) on conflict (slug) do update set`);
  w(`  name = excluded.name, category_id = excluded.category_id,`);
  w(`  short_description = excluded.short_description, description = excluded.description,`);
  w(`  technical_info = excluded.technical_info, installation_info = excluded.installation_info,`);
  w(`  delivery_info = excluded.delivery_info, material = excluded.material,`);
  w(`  dimensions = excluded.dimensions, sku = excluded.sku,`);
  w(`  price_rsd = excluded.price_rsd, sale_price_rsd = excluded.sale_price_rsd,`);
  w(`  price_on_request = excluded.price_on_request, stock = excluded.stock,`);
  w(`  tags = excluded.tags, is_featured = excluded.is_featured,`);
  w(`  is_published = excluded.is_published, is_archived = excluded.is_archived,`);
  w(`  sort_order = excluded.sort_order, seo_title = excluded.seo_title,`);
  w(`  seo_description = excluded.seo_description, og_image = excluded.og_image;`);
  w();

  for (const v of p.variants) {
    w(`insert into product_variants (`);
    w(`  product_id, finish_name, finish_code, finish_swatch, sku,`);
    w(`  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order`);
    w(`) values (`);
    w(`  (select id from products where slug = ${q(p.slug)}),`);
    w(`  ${q(v.finish_name)}, ${q(v.finish_code)}, ${q(v.finish_swatch)}, ${q(v.sku)},`);
    w(`  ${n(v.price_rsd)}, ${n(v.sale_price_rsd)}, ${v.stock}, ${q(v.dimensions)},`);
    w(`  ${q(v.main_image)}, ${arr(v.gallery)}, ${b(v.is_active)}, ${v.sort_order}`);
    w(`) on conflict (product_id, finish_code) do update set`);
    w(`  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,`);
    w(`  sku = excluded.sku, price_rsd = excluded.price_rsd,`);
    w(`  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,`);
    w(`  dimensions = excluded.dimensions, main_image = excluded.main_image,`);
    w(`  gallery = excluded.gallery, is_active = excluded.is_active,`);
    w(`  sort_order = excluded.sort_order;`);
    w();
  }

  // Galerija se postavlja iznova — jedini pouzdan način da redosled
  // i naslovna fotografija ostanu tačni bez duplikata.
  w(`delete from product_media where product_id = (select id from products where slug = ${q(p.slug)});`);
  w();
  for (const m of p.media) {
    const variantCode = m.variant_id
      ? p.variants.find((v) => v.id === m.variant_id)?.finish_code ?? null
      : null;
    w(`insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)`);
    w(`values (`);
    w(`  (select id from products where slug = ${q(p.slug)}),`);
    w(`  ${variantCode
      ? `(select v.id from product_variants v join products p on p.id = v.product_id where p.slug = ${q(p.slug)} and v.finish_code = ${q(variantCode)})`
      : 'NULL'},`);
    w(`  ${q(m.url)}, ${q(m.kind)}, ${q(m.poster_url)}, ${q(m.alt)}, ${b(m.is_cover)}, ${m.sort_order}`);
    w(`);`);
  }
  w();
}

// ---------- Sekcije početne strane ----------
w('-- ---------- Sekcije početne strane ----------');
for (const s of HOMEPAGE_SECTIONS) {
  w(`insert into homepage_sections (key, title, is_visible, sort_order, content)`);
  w(`values (${q(s.key)}, ${q(s.title)}, ${b(s.is_visible)}, ${s.sort_order}, ${json(s.content)})`);
  w(`on conflict (key) do update set`);
  w(`  title = excluded.title, is_visible = excluded.is_visible,`);
  w(`  sort_order = excluded.sort_order, content = excluded.content;`);
  w();
}

// ---------- Podešavanja ----------
w('-- ---------- Podešavanja sajta ----------');
const s = SITE_SETTINGS;
w(`insert into site_settings (`);
w(`  id, brand_name, contact_email, phone, instagram_url, address, currency,`);
w(`  delivery_cost_rsd, free_delivery_threshold_rsd, payment_methods,`);
w(`  seo_title, seo_description, footer_note, terms_text, privacy_text, delivery_text`);
w(`) values (`);
w(`  1, ${q(s.brand_name)}, ${q(s.contact_email)}, ${q(s.phone)}, ${q(s.instagram_url)},`);
w(`  ${q(s.address)}, ${q(s.currency)}, ${s.delivery_cost_rsd}, ${n(s.free_delivery_threshold_rsd)},`);
w(`  ${arr(s.payment_methods)},`);
w(`  ${q(s.seo_title)}, ${q(s.seo_description)}, ${q(s.footer_note)},`);
w(`  ${q(s.terms_text)}, ${q(s.privacy_text)}, ${q(s.delivery_text)}`);
w(`) on conflict (id) do update set`);
w(`  brand_name = excluded.brand_name, contact_email = excluded.contact_email,`);
w(`  phone = excluded.phone, instagram_url = excluded.instagram_url,`);
w(`  address = excluded.address, currency = excluded.currency,`);
w(`  delivery_cost_rsd = excluded.delivery_cost_rsd,`);
w(`  free_delivery_threshold_rsd = excluded.free_delivery_threshold_rsd,`);
w(`  payment_methods = excluded.payment_methods, seo_title = excluded.seo_title,`);
w(`  seo_description = excluded.seo_description, footer_note = excluded.footer_note,`);
w(`  terms_text = excluded.terms_text, privacy_text = excluded.privacy_text,`);
w(`  delivery_text = excluded.delivery_text;`);
w();
w('commit;');
w();
w('-- Provera:');
w('--   select count(*) from products;          -- očekivano: 3');
w('--   select count(*) from product_variants;  -- očekivano: 11');
w('--   select count(*) from product_media;     -- očekivano: 17');
w('--   select count(*) from homepage_sections; -- očekivano: 11');
w();

const target = resolve(process.cwd(), 'supabase/seed/seed.sql');
writeFileSync(target, out.join('\n'), 'utf8');
console.log(`✓ ${target} — ${out.length} linija`);
