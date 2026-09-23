-- =============================================================
-- HENG — fakture uz porudžbine
-- PDF fakture čuva se u privatnom bucket-u `heng-uploads` (fakture/…).
-- Upis obavlja server (service_role); admin čita preko postojeće politike.
-- Pustiti u Supabase SQL Editor-u. Bezbedno je pokrenuti više puta.
-- =============================================================
alter table orders add column if not exists invoice_path text;
alter table orders add column if not exists invoice_sent_at timestamptz;

notify pgrst, 'reload schema';
