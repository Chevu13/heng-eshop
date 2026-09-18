-- =============================================================
-- HENG — početni sadržaj (generisano iz src/lib/data/fixtures.ts)
--
-- Pokrenuti U SUPABASE SQL EDITOR-u, POSLE migracija 0001–0003.
-- Skripta je idempotentna: ponovno pokretanje ažurira postojeće
-- zapise po slug/key ključu i ne pravi duplikate.
-- =============================================================

begin;

-- ---------- Kategorije ----------
insert into categories (slug, title, description, cover_image, sort_order, is_published)
values ('nosaci-za-vinske-case', 'Nosači za vinske čaše', 'Zidni i podpultni profili koji čaše drže za stopu — vidljivo, uredno i bez dodatnog pribora.', '/assets/heng/products/model-01/model-01-sve-obrade.jpg', 1, true)
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  cover_image = excluded.cover_image, sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into categories (slug, title, description, cover_image, sort_order, is_published)
values ('nosaci-za-vinske-flase', 'Nosači za vinske flaše', 'Pojedinačni zidni nosači koji flašu drže u blagom nagibu i pretvaraju je u element kompozicije.', '/assets/heng/products/model-03/model-03-sve-obrade.jpg', 2, true)
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  cover_image = excluded.cover_image, sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into categories (slug, title, description, cover_image, sort_order, is_published)
values ('zidni-sistemi', 'Zidni sistemi', 'Kombinacije nosača u nizu — vinski zid, niša ili bar postavljeni kao jedinstvena celina.', '/assets/heng/interiors/mermerni-zid-flase-i-case.jpg', 3, true)
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  cover_image = excluded.cover_image, sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into categories (slug, title, description, cover_image, sort_order, is_published)
values ('projekti-po-meri', 'Projekti po meri', 'Postavke razvijene uz arhitektu ili izvođača, prilagođene dimenzijama i obradi konkretnog prostora.', '/assets/heng/interiors/vinski-zid-sa-slikom.jpg', 4, true)
on conflict (slug) do update set
  title = excluded.title, description = excluded.description,
  cover_image = excluded.cover_image, sort_order = excluded.sort_order,
  is_published = excluded.is_published;

-- ---------- Proizvodi, varijante i galerije ----------
-- Model 01
insert into products (
  slug, name, category_id, short_description, description, technical_info,
  installation_info, delivery_info, material, dimensions, sku,
  price_rsd, sale_price_rsd, price_on_request, stock, tags,
  is_featured, is_published, is_archived, sort_order,
  seo_title, seo_description, og_image
) values (
  'model-01', 'Model 01',
  (select id from categories where slug = 'nosaci-za-vinske-case'),
  'Rebrasti aluminijumski profil sa uzdužnim prorezom — čaše se ubacuju stopom i vise slobodno ispod police ili elementa.',
  'Model 01 je izveden kao pun profil sa finim uzdužnim rebrima koja svetlo prelamaju u tanke linije. Prorez po sredini prima stopu čaše, tako da niz čaša ostaje poravnat bez ikakvog vidljivog pribora. Profil se montira ispod police, gornjeg elementa kuhinje ili direktno na zid, i podjednako dobro funkcioniše u kućnom baru i u ugostiteljskom prostoru.',
  'Materijal: eloksirana legura aluminijuma.
Dimenzije: 31,5 × 8,6 × 2 cm.
Dostupne obrade: crna mat, zlatna, saten zlatna.
Montaža: dva otvora za pričvršćivanje na profilu.',
  'Profil se pričvršćuje kroz dva postojeća otvora. Preporučuje se montaža u nosivu podlogu ili odgovarajući tiplovani spoj, uz proveru da ispod profila ostane dovoljno visine za čašu.',
  'Isporuka na teritoriji Srbije. Rok i trošak isporuke potvrđuju se pri obradi porudžbine.',
  'Eloksirana legura aluminijuma', '31,5 × 8,6 × 2 cm', 'MODEL-01',
  1500, NULL, false, 25, ARRAY['čaše', 'profil', 'podpultna montaža']::text[],
  true, true, false, 1,
  'Model 01 — nosač za vinske čaše | HENG', 'Rebrasti aluminijumski profil za vinske čaše, 31,5 × 8,6 × 2 cm. Obrade: crna mat, zlatna, saten zlatna.', '/assets/heng/products/model-01/model-01-sve-obrade.jpg'
) on conflict (slug) do update set
  name = excluded.name, category_id = excluded.category_id,
  short_description = excluded.short_description, description = excluded.description,
  technical_info = excluded.technical_info, installation_info = excluded.installation_info,
  delivery_info = excluded.delivery_info, material = excluded.material,
  dimensions = excluded.dimensions, sku = excluded.sku,
  price_rsd = excluded.price_rsd, sale_price_rsd = excluded.sale_price_rsd,
  price_on_request = excluded.price_on_request, stock = excluded.stock,
  tags = excluded.tags, is_featured = excluded.is_featured,
  is_published = excluded.is_published, is_archived = excluded.is_archived,
  sort_order = excluded.sort_order, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, og_image = excluded.og_image;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-01'),
  'Crna mat', 'crna-mat', '#1C1416', 'MODEL-01-CRNA-MAT',
  1500, NULL, 25, '31,5 × 8,6 × 2 cm',
  '/assets/heng/products/model-01/model-01-crna-mat.jpg', ARRAY['/assets/heng/products/model-01/model-01-crna-mat.jpg', '/assets/heng/products/model-01/model-01-sve-obrade.jpg', '/assets/heng/products/model-01/model-01-dimenzije.jpg']::text[], true, 0
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-01'),
  'Zlatna', 'zlatna', '#C79A4A', 'MODEL-01-ZLATNA',
  1500, NULL, 25, '31,5 × 8,6 × 2 cm',
  '/assets/heng/products/model-01/model-01-zlatna.jpg', ARRAY['/assets/heng/products/model-01/model-01-zlatna.jpg', '/assets/heng/products/model-01/model-01-sve-obrade.jpg', '/assets/heng/products/model-01/model-01-dimenzije.jpg']::text[], true, 1
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-01'),
  'Saten zlatna', 'saten-zlatna', '#D8B45E', 'MODEL-01-SATEN-ZLATNA',
  1500, NULL, 25, '31,5 × 8,6 × 2 cm',
  '/assets/heng/products/model-01/model-01-saten-zlatna.jpg', ARRAY['/assets/heng/products/model-01/model-01-saten-zlatna.jpg', '/assets/heng/products/model-01/model-01-sve-obrade.jpg', '/assets/heng/products/model-01/model-01-dimenzije.jpg']::text[], true, 2
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

delete from product_media where product_id = (select id from products where slug = 'model-01');

insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-01'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-01' and v.finish_code = 'crna-mat'),
  '/assets/heng/products/model-01/model-01-crna-mat.jpg', 'image', NULL, 'Model 01 u crnoj mat obradi', true, 0
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-01'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-01' and v.finish_code = 'zlatna'),
  '/assets/heng/products/model-01/model-01-zlatna.jpg', 'image', NULL, 'Model 01 u zlatnoj obradi', false, 1
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-01'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-01' and v.finish_code = 'saten-zlatna'),
  '/assets/heng/products/model-01/model-01-saten-zlatna.jpg', 'image', NULL, 'Model 01 u saten zlatnoj obradi', false, 2
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-01'),
  NULL,
  '/assets/heng/products/model-01/model-01-sve-obrade.jpg', 'image', NULL, 'Model 01 — sve dostupne završne obrade', false, 3
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-01'),
  NULL,
  '/assets/heng/products/model-01/model-01-dimenzije.jpg', 'image', NULL, 'Model 01 — kotirana fotografija sa dimenzijama', false, 4
);

-- Model 02
insert into products (
  slug, name, category_id, short_description, description, technical_info,
  installation_info, delivery_info, material, dimensions, sku,
  price_rsd, sale_price_rsd, price_on_request, stock, tags,
  is_featured, is_published, is_archived, sort_order,
  seo_title, seo_description, og_image
) values (
  'model-02', 'Model 02',
  (select id from categories where slug = 'nosaci-za-vinske-case'),
  'Ugaoni nosač sa dugim zaobljenim prorezom — čaše ulaze bočno i ostaju vidljive celom dužinom stope.',
  'Model 02 je sečen iz punog aluminijumskog lima i savijen u ugaoni oslonac. Dugačak prorez sa zaobljenim krajem prima stopu čaše i drži je bez pritiska na staklo. Zbog većeg razmaka od zida, model prima i čaše sa širom kupom i može se montirati u nizu kao kontinuirana linija ili pojedinačno, kao samostalan detalj.',
  'Materijal: eloksirana legura aluminijuma.
Dimenzije: 30 × 10 × 4 cm.
Dostupne obrade: crna mat, grafit, zlatna, saten zlatna.
Montaža: dva otvora na leđnoj strani nosača.',
  'Nosač se montira kroz dva otvora na vertikalnoj strani. Pri montaži u nizu preporučuje se obeležavanje zajedničke ose kako bi prorezi ostali poravnati.',
  'Isporuka na teritoriji Srbije. Rok i trošak isporuke potvrđuju se pri obradi porudžbine.',
  'Eloksirana legura aluminijuma', '30 × 10 × 4 cm', 'MODEL-02',
  2000, NULL, false, 25, ARRAY['čaše', 'ugaoni nosač', 'zidna montaža']::text[],
  true, true, false, 2,
  'Model 02 — ugaoni nosač za vinske čaše | HENG', 'Aluminijumski ugaoni nosač za vinske čaše, 30 × 10 × 4 cm. Obrade: crna mat, grafit, zlatna, saten zlatna.', '/assets/heng/products/model-02/model-02-sve-obrade.jpg'
) on conflict (slug) do update set
  name = excluded.name, category_id = excluded.category_id,
  short_description = excluded.short_description, description = excluded.description,
  technical_info = excluded.technical_info, installation_info = excluded.installation_info,
  delivery_info = excluded.delivery_info, material = excluded.material,
  dimensions = excluded.dimensions, sku = excluded.sku,
  price_rsd = excluded.price_rsd, sale_price_rsd = excluded.sale_price_rsd,
  price_on_request = excluded.price_on_request, stock = excluded.stock,
  tags = excluded.tags, is_featured = excluded.is_featured,
  is_published = excluded.is_published, is_archived = excluded.is_archived,
  sort_order = excluded.sort_order, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, og_image = excluded.og_image;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-02'),
  'Crna mat', 'crna-mat', '#1C1416', 'MODEL-02-CRNA-MAT',
  2000, NULL, 25, '30 × 10 × 4 cm',
  '/assets/heng/products/model-02/model-02-crna-mat.jpg', ARRAY['/assets/heng/products/model-02/model-02-crna-mat.jpg', '/assets/heng/products/model-02/model-02-sve-obrade.jpg', '/assets/heng/products/model-02/model-02-dimenzije.jpg']::text[], true, 0
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-02'),
  'Grafit', 'grafit', '#8C8477', 'MODEL-02-GRAFIT',
  2000, NULL, 25, '30 × 10 × 4 cm',
  '/assets/heng/products/model-02/model-02-grafit.jpg', ARRAY['/assets/heng/products/model-02/model-02-grafit.jpg', '/assets/heng/products/model-02/model-02-sve-obrade.jpg', '/assets/heng/products/model-02/model-02-dimenzije.jpg']::text[], true, 1
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-02'),
  'Zlatna', 'zlatna', '#C79A4A', 'MODEL-02-ZLATNA',
  2000, NULL, 25, '30 × 10 × 4 cm',
  '/assets/heng/products/model-02/model-02-zlatna.jpg', ARRAY['/assets/heng/products/model-02/model-02-zlatna.jpg', '/assets/heng/products/model-02/model-02-sve-obrade.jpg', '/assets/heng/products/model-02/model-02-dimenzije.jpg']::text[], true, 2
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-02'),
  'Saten zlatna', 'saten-zlatna', '#D8B45E', 'MODEL-02-SATEN-ZLATNA',
  2000, NULL, 25, '30 × 10 × 4 cm',
  '/assets/heng/products/model-02/model-02-saten-zlatna.jpg', ARRAY['/assets/heng/products/model-02/model-02-saten-zlatna.jpg', '/assets/heng/products/model-02/model-02-sve-obrade.jpg', '/assets/heng/products/model-02/model-02-dimenzije.jpg']::text[], true, 3
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

delete from product_media where product_id = (select id from products where slug = 'model-02');

insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-02'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-02' and v.finish_code = 'crna-mat'),
  '/assets/heng/products/model-02/model-02-crna-mat.jpg', 'image', NULL, 'Model 02 u crnoj mat obradi', true, 0
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-02'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-02' and v.finish_code = 'grafit'),
  '/assets/heng/products/model-02/model-02-grafit.jpg', 'image', NULL, 'Model 02 u grafit obradi', false, 1
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-02'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-02' and v.finish_code = 'zlatna'),
  '/assets/heng/products/model-02/model-02-zlatna.jpg', 'image', NULL, 'Model 02 u zlatnoj obradi', false, 2
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-02'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-02' and v.finish_code = 'saten-zlatna'),
  '/assets/heng/products/model-02/model-02-saten-zlatna.jpg', 'image', NULL, 'Model 02 u saten zlatnoj obradi', false, 3
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-02'),
  NULL,
  '/assets/heng/products/model-02/model-02-sve-obrade.jpg', 'image', NULL, 'Model 02 — sve dostupne završne obrade', false, 4
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-02'),
  NULL,
  '/assets/heng/products/model-02/model-02-dimenzije.jpg', 'image', NULL, 'Model 02 — kotirana fotografija sa dimenzijama', false, 5
);

-- Model 03
insert into products (
  slug, name, category_id, short_description, description, technical_info,
  installation_info, delivery_info, material, dimensions, sku,
  price_rsd, sale_price_rsd, price_on_request, stock, tags,
  is_featured, is_published, is_archived, sort_order,
  seo_title, seo_description, og_image
) values (
  'model-03', 'Model 03',
  (select id from categories where slug = 'nosaci-za-vinske-flase'),
  'Pravougaoni okvir za flašu — vino stoji u blagom nagibu, etiketa ostaje okrenuta ka prostoru.',
  'Model 03 je zidni nosač za flašu izveden kao zatvoren pravougaoni okvir sa leđnim osloncem. Flaša prolazi kroz okvir i naslanja se pod uglom, tako da etiketa ostaje čitljiva iz prostorije. Postavljen u niz ili u ritmičnu mrežu, model gradi vinski zid koji se čita kao arhitektonski detalj, a ne kao polica.',
  'Materijal: eloksirana legura aluminijuma.
Dimenzije: 27 × 10 × 4 cm.
Dostupne obrade: crna mat, grafit, zlatna, saten zlatna.
Montaža: dva otvora na leđnoj strani nosača.',
  'Nosač se pričvršćuje kroz dva otvora na leđnoj ploči. Za vinske zidove preporučuje se prethodno raspoređivanje na crtežu, kako bi vertikalni i horizontalni razmaci ostali dosledni.',
  'Isporuka na teritoriji Srbije. Rok i trošak isporuke potvrđuju se pri obradi porudžbine.',
  'Eloksirana legura aluminijuma', '27 × 10 × 4 cm', 'MODEL-03',
  4000, NULL, false, 25, ARRAY['flaše', 'vinski zid', 'zidna montaža']::text[],
  true, true, false, 3,
  'Model 03 — zidni nosač za vinske flaše | HENG', 'Aluminijumski zidni nosač za flašu vina, 27 × 10 × 4 cm. Obrade: crna mat, grafit, zlatna, saten zlatna.', '/assets/heng/products/model-03/model-03-sve-obrade.jpg'
) on conflict (slug) do update set
  name = excluded.name, category_id = excluded.category_id,
  short_description = excluded.short_description, description = excluded.description,
  technical_info = excluded.technical_info, installation_info = excluded.installation_info,
  delivery_info = excluded.delivery_info, material = excluded.material,
  dimensions = excluded.dimensions, sku = excluded.sku,
  price_rsd = excluded.price_rsd, sale_price_rsd = excluded.sale_price_rsd,
  price_on_request = excluded.price_on_request, stock = excluded.stock,
  tags = excluded.tags, is_featured = excluded.is_featured,
  is_published = excluded.is_published, is_archived = excluded.is_archived,
  sort_order = excluded.sort_order, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, og_image = excluded.og_image;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-03'),
  'Crna mat', 'crna-mat', '#1C1416', 'MODEL-03-CRNA-MAT',
  4000, NULL, 25, '27 × 10 × 4 cm',
  '/assets/heng/products/model-03/model-03-crna-mat.jpg', ARRAY['/assets/heng/products/model-03/model-03-crna-mat.jpg', '/assets/heng/products/model-03/model-03-sve-obrade.jpg', '/assets/heng/products/model-03/model-03-dimenzije.jpg']::text[], true, 0
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-03'),
  'Grafit', 'grafit', '#8C8477', 'MODEL-03-GRAFIT',
  4000, NULL, 25, '27 × 10 × 4 cm',
  '/assets/heng/products/model-03/model-03-grafit.jpg', ARRAY['/assets/heng/products/model-03/model-03-grafit.jpg', '/assets/heng/products/model-03/model-03-sve-obrade.jpg', '/assets/heng/products/model-03/model-03-dimenzije.jpg']::text[], true, 1
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-03'),
  'Zlatna', 'zlatna', '#C79A4A', 'MODEL-03-ZLATNA',
  4000, NULL, 25, '27 × 10 × 4 cm',
  '/assets/heng/products/model-03/model-03-zlatna.jpg', ARRAY['/assets/heng/products/model-03/model-03-zlatna.jpg', '/assets/heng/products/model-03/model-03-sve-obrade.jpg', '/assets/heng/products/model-03/model-03-dimenzije.jpg']::text[], true, 2
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into product_variants (
  product_id, finish_name, finish_code, finish_swatch, sku,
  price_rsd, sale_price_rsd, stock, dimensions, main_image, gallery, is_active, sort_order
) values (
  (select id from products where slug = 'model-03'),
  'Saten zlatna', 'saten-zlatna', '#D8B45E', 'MODEL-03-SATEN-ZLATNA',
  4000, NULL, 25, '27 × 10 × 4 cm',
  '/assets/heng/products/model-03/model-03-saten-zlatna.jpg', ARRAY['/assets/heng/products/model-03/model-03-saten-zlatna.jpg', '/assets/heng/products/model-03/model-03-sve-obrade.jpg', '/assets/heng/products/model-03/model-03-dimenzije.jpg']::text[], true, 3
) on conflict (product_id, finish_code) do update set
  finish_name = excluded.finish_name, finish_swatch = excluded.finish_swatch,
  sku = excluded.sku, price_rsd = excluded.price_rsd,
  sale_price_rsd = excluded.sale_price_rsd, stock = excluded.stock,
  dimensions = excluded.dimensions, main_image = excluded.main_image,
  gallery = excluded.gallery, is_active = excluded.is_active,
  sort_order = excluded.sort_order;

delete from product_media where product_id = (select id from products where slug = 'model-03');

insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-03'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-03' and v.finish_code = 'crna-mat'),
  '/assets/heng/products/model-03/model-03-crna-mat.jpg', 'image', NULL, 'Model 03 u crnoj mat obradi', true, 0
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-03'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-03' and v.finish_code = 'grafit'),
  '/assets/heng/products/model-03/model-03-grafit.jpg', 'image', NULL, 'Model 03 u grafit obradi', false, 1
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-03'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-03' and v.finish_code = 'zlatna'),
  '/assets/heng/products/model-03/model-03-zlatna.jpg', 'image', NULL, 'Model 03 u zlatnoj obradi', false, 2
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-03'),
  (select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'model-03' and v.finish_code = 'saten-zlatna'),
  '/assets/heng/products/model-03/model-03-saten-zlatna.jpg', 'image', NULL, 'Model 03 u saten zlatnoj obradi', false, 3
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-03'),
  NULL,
  '/assets/heng/products/model-03/model-03-sve-obrade.jpg', 'image', NULL, 'Model 03 — sve dostupne završne obrade', false, 4
);
insert into product_media (product_id, variant_id, url, kind, poster_url, alt, is_cover, sort_order)
values (
  (select id from products where slug = 'model-03'),
  NULL,
  '/assets/heng/products/model-03/model-03-dimenzije.jpg', 'image', NULL, 'Model 03 — kotirana fotografija sa dimenzijama', false, 5
);

-- ---------- Sekcije početne strane ----------
insert into homepage_sections (key, title, is_visible, sort_order, content)
values ('hero', 'Hero', true, 0, '{"heading":"Detalji koji znače.","body":"HENG proizvodi spajaju funkciju, vrhunsku izradu i savremenu estetiku — za prostor koji se izdvaja.","primaryLabel":"Pogledaj proizvode","primaryHref":"/kolekcija","mediaUrl":"/assets/heng/lifestyle/zlatna-letva-sa-casama-hero.jpg","mediaAlt":"Čaše obešene na zlatnoj HENG letvi ispod kuhinjskog elementa","videoUrl":null,"videoPoster":null}'::jsonb)
on conflict (key) do update set
  title = excluded.title, is_visible = excluded.is_visible,
  sort_order = excluded.sort_order, content = excluded.content;

insert into homepage_sections (key, title, is_visible, sort_order, content)
values ('categories', 'Kategorije', true, 1, '{"items":[{"title":"Ručke od prirodnog kamena","body":"Prirodna lepota pretvorena u sofisticiran element savremenog enterijera.","href":"/kolekcija","ctaLabel":"Istraži proizvode","mediaUrl":"/assets/heng/lifestyle/rucke-od-prirodnog-kamena-vertikalno.jpg","mediaAlt":"Okrugle ručke od prirodnog kamena na frontu kuhinjskog elementa","mediaPosition":"center 30%"},{"title":"Držači za vino i čaše","body":"Sveden dizajn i funkcionalnost koji kolekciji vina daju svoje mesto u prostoru.","href":"/kolekcija","ctaLabel":"Istraži proizvode","mediaUrl":"/assets/heng/lifestyle/case-nad-barom-heng-kadar.jpg","mediaAlt":"Čaše obešene na HENG letvi iznad barskog elementa","mediaPosition":"center top"}]}'::jsonb)
on conflict (key) do update set
  title = excluded.title, is_visible = excluded.is_visible,
  sort_order = excluded.sort_order, content = excluded.content;

insert into homepage_sections (key, title, is_visible, sort_order, content)
values ('material', 'Držači za vino i čaše', true, 2, '{"eyebrow":"MATERIJAL","heading":"Oblikovano da traje.","body":"HENG sistemi izrađeni su od eloksirane legure aluminijuma, sa završnim obradama koje se uklapaju u savremene kuhinje, vinske kutke i enterijere po meri.","points":[{"title":"Eloksirana legura aluminijuma","text":"Obrada se izvodi na samom materijalu, bez sloja koji se ljušti."},{"title":"Preciznost u svakom detalju","text":"Prorezi, radijusi i otvori za montažu izvedeni su u istoj toleranciji na svakom komadu."},{"title":"Skrivena montaža","text":"Vidljiv ostaje samo profil — pričvršćenje se povlači u pozadinu."}],"mediaUrl":"/assets/heng/products/model-01/model-01-sve-obrade.jpg","mediaAlt":"Model 01 — sve dostupne završne obrade jedna uz drugu","ctaLabel":"Istraži držače","ctaHref":"/kolekcija"}'::jsonb)
on conflict (key) do update set
  title = excluded.title, is_visible = excluded.is_visible,
  sort_order = excluded.sort_order, content = excluded.content;

insert into homepage_sections (key, title, is_visible, sort_order, content)
values ('handles', 'Ručke od prirodnog kamena', true, 3, '{"eyebrow":"RUČKE OD PRIRODNOG KAMENA","heading":"Svaki komad je original.","body":"Kamen se ne proizvodi — vadi se, seče i polira. Zato nijedna ručka nije ista: šara, ton i zrno ostaju onakvi kakvim ih je blok ostavio.","points":[{"title":"Prirodni kamen, bez imitacije","text":"Mermer i travertin obrađeni do svilenog dodira, sa vidljivim tokom šare."},{"title":"Nijedna šara se ne ponavlja","text":"Svaki komad je jedinstven — kao potpis na frontu koji se svakodnevno dodiruje."},{"title":"Menja izgled nameštaja","text":"Ista kuhinja sa drugom ručkom čita se drugačije: detalj nosi ceo utisak prostora."}],"mediaUrl":"/assets/heng/lifestyle/rucke-od-prirodnog-kamena.jpg","mediaAlt":"Okrugle ručke od prirodnog kamena na frontu kuhinjskog elementa","ctaLabel":"Istraži ručke","ctaHref":"/kolekcija"}'::jsonb)
on conflict (key) do update set
  title = excluded.title, is_visible = excluded.is_visible,
  sort_order = excluded.sort_order, content = excluded.content;

-- ---------- Podešavanja sajta ----------
insert into site_settings (
  id, brand_name, contact_email, phone, instagram_url, address, currency,
  delivery_cost_rsd, free_delivery_threshold_rsd, payment_methods,
  seo_title, seo_description, footer_note, terms_text, privacy_text, delivery_text
) values (
  1, 'HENG', 'info@heng.rs', NULL, 'https://www.instagram.com/heng.srb/',
  'Srbija', 'RSD', 0, NULL,
  ARRAY['pouzecem', 'predracun']::text[],
  'HENG — nosači za vino i čaše', 'Aluminijumski nosači za vinske flaše i čaše. Arhitektonski detalj za kuhinje, barove i enterijere po meri.', 'Dizajn za vino. Detalj za prostor.',
  NULL, NULL, NULL
) on conflict (id) do update set
  brand_name = excluded.brand_name, contact_email = excluded.contact_email,
  phone = excluded.phone, instagram_url = excluded.instagram_url,
  address = excluded.address, currency = excluded.currency,
  delivery_cost_rsd = excluded.delivery_cost_rsd,
  free_delivery_threshold_rsd = excluded.free_delivery_threshold_rsd,
  payment_methods = excluded.payment_methods, seo_title = excluded.seo_title,
  seo_description = excluded.seo_description, footer_note = excluded.footer_note,
  terms_text = excluded.terms_text, privacy_text = excluded.privacy_text,
  delivery_text = excluded.delivery_text;

commit;

-- Provera:
--   select count(*) from products;          -- očekivano: 3
--   select count(*) from product_variants;  -- očekivano: 11
--   select count(*) from product_media;     -- očekivano: 17
--   select count(*) from homepage_sections; -- očekivano: 4
