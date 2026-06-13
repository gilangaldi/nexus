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
