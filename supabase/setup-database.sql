-- Jalankan file ini di Supabase Dashboard → SQL Editor jika tabel belum ada.
-- Project: htssjorrdxdliouzmayd
-- URL: https://supabase.com/dashboard/project/htssjorrdxdliouzmayd/sql

-- Pastikan kategori ada (aman dijalankan ulang)
INSERT INTO public.categories (slug, name, description, icon, sort_order) VALUES
  ('characters', 'Characters', '3D characters and creatures', 'User', 1),
  ('3d-models', '3D Models', 'Props, vehicles, weapons', 'Box', 2),
  ('environments', 'Environments', 'Levels, terrains, scenes', 'Mountain', 3),
  ('ui-kits', 'UI Kits', 'HUDs, menus, interfaces', 'LayoutGrid', 4),
  ('audio', 'Audio', 'SFX, music, voice', 'Music', 5),
  ('scripts', 'Scripts', 'Game logic and tools', 'Code', 6),
  ('vfx', 'VFX', 'Particles and shaders', 'Sparkles', 7),
  ('animations', 'Animations', 'Mocap and rigs', 'Activity', 8)
ON CONFLICT (slug) DO NOTHING;

-- Matikan konfirmasi email agar login langsung jalan (penting untuk wallet & sign up)
-- Buka: Authentication → Providers → Email → NONAKTIFKAN "Confirm email"

-- Aktifkan Google OAuth di: Authentication → Providers → Google
-- Tambahkan redirect URL: https://nexus-gamenft.vercel.app (dan localhost untuk dev)

-- Storage bucket untuk thumbnail asset (jalankan jika belum ada)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nexus-assets',
  'nexus-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY IF NOT EXISTS "Public read nexus-assets"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'nexus-assets');

CREATE POLICY IF NOT EXISTS "Users upload own nexus-assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'nexus-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY IF NOT EXISTS "Users update own nexus-assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'nexus-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY IF NOT EXISTS "Users delete own nexus-assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'nexus-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
