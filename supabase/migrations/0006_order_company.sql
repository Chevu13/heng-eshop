-- =============================================================
-- HENG — podaci o firmi uz porudžbinu (plaćanje profakturom)
-- Pustiti u Supabase SQL Editor-u. Bezbedno je pokrenuti više puta.
-- Dok se ne pokrene, sajt podatke o firmi upisuje u napomenu porudžbine.
-- =============================================================
alter table orders add column if not exists company_name text;
alter table orders add column if not exists company_pib text;
alter table orders add column if not exists company_address text;

notify pgrst, 'reload schema';
