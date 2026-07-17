-- =============================================================
-- HENG — Storage bucket-i i politike
-- =============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('heng-media', 'heng-media', true, 26214400,
   array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm']),
  ('heng-uploads', 'heng-uploads', false, 10485760,
   array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;

-- Javni katalog medija: svako čita, samo admin piše.
create policy "heng-media: javno čitanje" on storage.objects
  for select using (bucket_id = 'heng-media');
create policy "heng-media: admin upis" on storage.objects
  for insert with check (bucket_id = 'heng-media' and is_admin());
create policy "heng-media: admin izmena" on storage.objects
  for update using (bucket_id = 'heng-media' and is_admin());
create policy "heng-media: admin brisanje" on storage.objects
  for delete using (bucket_id = 'heng-media' and is_admin());

-- Prilozi uz projektne upite: čita samo admin, upisuje server.
create policy "heng-uploads: admin čitanje" on storage.objects
  for select using (bucket_id = 'heng-uploads' and is_admin());
create policy "heng-uploads: admin brisanje" on storage.objects
  for delete using (bucket_id = 'heng-uploads' and is_admin());
