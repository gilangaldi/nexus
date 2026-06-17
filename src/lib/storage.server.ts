const BUCKET_ID = "nexus-assets";

const BUCKET_OPTIONS = {
  public: true,
  fileSizeLimit: 10 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
};

export async function ensureNexusAssetsBucket() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: existing, error: getError } = await supabaseAdmin.storage.getBucket(BUCKET_ID);

  if (existing && !getError) return { created: false as const };

  const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_ID, BUCKET_OPTIONS);
  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    throw new Error(`Gagal membuat bucket storage: ${createError.message}`);
  }

  return { created: true as const };
}

export async function uploadNexusAssetThumbnail(userId: string, fileName: string, bytes: Uint8Array, contentType: string) {
  await ensureNexusAssetsBucket();

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const { randomId } = await import("@/lib/crypto-polyfill");
  const path = `${userId}/${randomId()}.${ext}`;

  const { data, error } = await supabaseAdmin.storage.from(BUCKET_ID).upload(path, bytes, {
    cacheControl: "3600",
    upsert: false,
    contentType: contentType || "image/jpeg",
  });

  if (error) throw new Error(`Gagal upload gambar: ${error.message}`);

  const { data: urlData } = supabaseAdmin.storage.from(BUCKET_ID).getPublicUrl(data.path);
  return { path: data.path, publicUrl: urlData.publicUrl };
}

export async function removeNexusAssetThumbnail(storagePath: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.storage.from(BUCKET_ID).remove([storagePath]);
}
