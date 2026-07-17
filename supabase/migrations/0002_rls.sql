-- =============================================================
-- HENG — Row Level Security
-- Princip: javnost čita samo objavljeni katalog; upis je isključivo
-- kroz server (service-role) ili verifikovanog admina.
-- =============================================================

alter table profiles           enable row level security;
alter table categories         enable row level security;
alter table products           enable row level security;
alter table product_variants   enable row level security;
alter table product_media      enable row level security;
alter table orders             enable row level security;
alter table order_items        enable row level security;
alter table project_inquiries  enable row level security;
alter table homepage_sections  enable row level security;
alter table site_settings      enable row level security;

-- ---------- profiles ----------
create policy "profil: čitanje sopstvenog" on profiles
  for select using (auth.uid() = id or is_admin());
create policy "profil: admin upravlja" on profiles
  for all using (is_admin()) with check (is_admin());

-- ---------- categories ----------
create policy "kategorije: javno čitanje objavljenih" on categories
  for select using (is_published or is_admin());
create policy "kategorije: admin upis" on categories
  for all using (is_admin()) with check (is_admin());

-- ---------- products ----------
create policy "proizvodi: javno čitanje objavljenih" on products
  for select using ((is_published and not is_archived) or is_admin());
create policy "proizvodi: admin upis" on products
  for all using (is_admin()) with check (is_admin());

-- ---------- product_variants ----------
create policy "varijante: javno čitanje aktivnih" on product_variants
  for select using (
    is_admin() or (
      is_active and exists (
        select 1 from products p
        where p.id = product_id and p.is_published and not p.is_archived
      )
    )
  );
create policy "varijante: admin upis" on product_variants
  for all using (is_admin()) with check (is_admin());

-- ---------- product_media ----------
create policy "mediji: javno čitanje" on product_media
  for select using (
    is_admin() or exists (
      select 1 from products p
      where p.id = product_id and p.is_published and not p.is_archived
    )
  );
create policy "mediji: admin upis" on product_media
  for all using (is_admin()) with check (is_admin());

-- ---------- orders / order_items ----------
-- Anonimno kreiranje porudžbina NIJE dozvoljeno preko anon ključa.
-- Porudžbine kreira server route (service-role) posle validacije.
create policy "porudžbine: admin čita" on orders
  for select using (is_admin());
create policy "porudžbine: admin upis" on orders
  for all using (is_admin()) with check (is_admin());

create policy "stavke: admin čita" on order_items
  for select using (is_admin());
create policy "stavke: admin upis" on order_items
  for all using (is_admin()) with check (is_admin());

-- ---------- project_inquiries ----------
create policy "upiti: admin čita" on project_inquiries
  for select using (is_admin());
create policy "upiti: admin upis" on project_inquiries
  for all using (is_admin()) with check (is_admin());

-- ---------- homepage_sections ----------
create policy "pocetna: javno čitanje" on homepage_sections
  for select using (true);
create policy "pocetna: admin upis" on homepage_sections
  for all using (is_admin()) with check (is_admin());

-- ---------- site_settings ----------
create policy "podesavanja: javno čitanje" on site_settings
  for select using (true);
create policy "podesavanja: admin upis" on site_settings
  for all using (is_admin()) with check (is_admin());
