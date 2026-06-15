-- Storage bucket for asset thumbnails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nexus-assets',
  'nexus-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read access for marketplace thumbnails
DROP POLICY IF EXISTS "Public read nexus-assets" ON storage.objects;
CREATE POLICY "Public read nexus-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'nexus-assets');

-- Authenticated users upload to their own folder
DROP POLICY IF EXISTS "Users upload own nexus-assets" ON storage.objects;
CREATE POLICY "Users upload own nexus-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'nexus-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own files
DROP POLICY IF EXISTS "Users update own nexus-assets" ON storage.objects;
CREATE POLICY "Users update own nexus-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'nexus-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own files
DROP POLICY IF EXISTS "Users delete own nexus-assets" ON storage.objects;
CREATE POLICY "Users delete own nexus-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'nexus-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
