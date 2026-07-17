-- =============================================================
-- HENG — inicijalna šema
-- =============================================================
create extension if not exists "pgcrypto";

-- ---------- ENUM tipovi ----------
do $$ begin
  create type order_status as enum ('nova','potvrdjena','u_pripremi','poslata','zavrsena','otkazana');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inquiry_status as enum ('nov','kontaktiran','zavrsen');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('pouzecem','predracun');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('admin','viewer');
exception when duplicate_object then null; end $$;

-- ---------- Zajednički trigger ----------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- Svaki novi auth korisnik dobija profil sa ulogom 'viewer'.
-- Admin se dodeljuje ručno (vidi README).
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- categories ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_image text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists categories_published_idx on categories (is_published, sort_order);
create trigger categories_updated before update on categories
  for each row execute function set_updated_at();

-- ---------- products ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references categories(id) on delete set null,
  short_description text,
  description text,
  technical_info text,
  installation_info text,
  delivery_info text,
  material text,
  dimensions text,
  sku text,
  price_rsd numeric(12,2),          -- NULL => "Cena na upit"
  sale_price_rsd numeric(12,2),
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  price_on_request boolean not null default true,
  stock int not null default 0,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_published boolean not null default false,
  is_archived boolean not null default false,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_slug_idx on products (slug);
create index if not exists products_category_idx on products (category_id);
create index if not exists products_listing_idx on products (is_published, is_archived, sort_order);
create index if not exists products_featured_idx on products (is_featured) where is_featured;
create trigger products_updated before update on products
  for each row execute function set_updated_at();

-- ---------- product_variants (završne obrade) ----------
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  finish_name text not null,        -- npr. "Crna mat"
  finish_code text not null,        -- npr. "crna-mat"
  finish_swatch text,               -- hex ili URL uzorka materijala
  sku text,
  price_rsd numeric(12,2),
  sale_price_rsd numeric(12,2),
  stock int not null default 0,
  dimensions text,
  main_image text,
  gallery text[] not null default '{}',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, finish_code)
);
create index if not exists variants_product_idx on product_variants (product_id, sort_order);
create trigger variants_updated before update on product_variants
  for each row execute function set_updated_at();

-- ---------- product_media ----------
create table if not exists product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  url text not null,
  kind text not null default 'image' check (kind in ('image','video')),
  poster_url text,
  alt text,
  is_cover boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists media_product_idx on product_media (product_id, sort_order);

-- ---------- orders ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  status order_status not null default 'nova',
  full_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  note text,
  payment payment_method not null default 'pouzecem',
  subtotal_rsd numeric(12,2) not null default 0,
  delivery_rsd numeric(12,2) not null default 0,
  total_rsd numeric(12,2) not null default 0,
  has_request_items boolean not null default false, -- sadrži stavke "cena na upit"
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_status_idx on orders (status, created_at desc);
create trigger orders_updated before update on orders
  for each row execute function set_updated_at();

-- ---------- order_items ----------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  finish_name text,
  sku text,
  unit_price_rsd numeric(12,2),     -- NULL => na upit
  quantity int not null check (quantity > 0),
  line_total_rsd numeric(12,2),
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_idx on order_items (order_id);

-- ---------- project_inquiries ----------
create table if not exists project_inquiries (
  id uuid primary key default gen_random_uuid(),
  status inquiry_status not null default 'nov',
  full_name text not null,
  company text,
  email text not null,
  phone text,
  project_type text,
  location text,
  description text not null,
  desired_products text,
  deadline text,
  attachment_url text,
  consent boolean not null default false,
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists inquiries_status_idx on project_inquiries (status, created_at desc);
create trigger inquiries_updated before update on project_inquiries
  for each row execute function set_updated_at();

-- ---------- homepage_sections ----------
create table if not exists homepage_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,      -- announcement | hero | statement | featured | finishes | material | gallery | dimensions | projects | instagram | final_cta
  title text,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger homepage_updated before update on homepage_sections
  for each row execute function set_updated_at();

-- ---------- site_settings (singleton) ----------
create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'HENG',
  contact_email text,
  phone text,
  instagram_url text default 'https://www.instagram.com/heng.srb/',
  address text,
  currency text not null default 'RSD',
  delivery_cost_rsd numeric(12,2) not null default 0,
  free_delivery_threshold_rsd numeric(12,2),
  payment_methods text[] not null default array['pouzecem','predracun'],
  seo_title text,
  seo_description text,
  footer_note text,
  terms_text text,
  privacy_text text,
  delivery_text text,
  updated_at timestamptz not null default now()
);
create trigger settings_updated before update on site_settings
  for each row execute function set_updated_at();
