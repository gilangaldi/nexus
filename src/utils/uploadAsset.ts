// src/utils/uploadAsset.ts
// Utility untuk upload asset ke Supabase Storage
// Menggantikan logika upload yang ada di Sell.tsx

import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = "assets";

/**
 * Memastikan bucket "assets" ada. Jika belum ada, buat baru.
 * PENTING: Ini harus dijalankan dengan service_role key di backend/edge function,
 * bukan dari frontend dengan anon key.
 * 
 * Di frontend (Sell.tsx), kita cukup langsung upload — bucket sudah harus ada.
 */
export async function ensureBucketExists() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error("Gagal list bucket:", listError.message);
    return false;
  }

  const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);

  if (!bucketExists) {
    // Membuat bucket hanya bisa dengan service_role, bukan anon key
    // Jika error di sini, berarti bucket perlu dibuat manual di Supabase Dashboard
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
    });

    if (createError) {
      console.error("Gagal membuat bucket:", createError.message);
      // Jangan lempar error ke user untuk ini — tampilkan pesan yang lebih jelas
      return false;
    }
  }

  return true;
}

/**
 * Upload file asset ke Supabase Storage
 * @param file - File yang akan diupload
 * @param walletAddress - Alamat wallet user (sebagai folder)
 * @returns URL publik file yang diupload, atau null jika gagal
 */
export async function uploadAssetFile(
  file: File,
  walletAddress: string
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${walletAddress}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error.message);
    throw new Error(`Gagal upload file: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Simpan data asset ke tabel `assets` di Supabase
 */
export async function saveAssetToDatabase(asset: {
  name: string;
  description: string;
  price: number;
  image_url: string;
  seller_wallet: string;
  category?: string;
}) {
  const { data, error } = await supabase
    .from("assets")
    .insert([
      {
        ...asset,
        created_at: new Date().toISOString(),
        is_sold: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Gagal simpan asset:", error.message);
    throw new Error(`Gagal menyimpan asset: ${error.message}`);
  }

  return data;
}
