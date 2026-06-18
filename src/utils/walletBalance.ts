// src/utils/walletBalance.ts
// Perbaikan bug "user no have coin on wallet"

import { supabase } from "@/integrations/supabase/client";

/**
 * Mengambil balance koin user berdasarkan wallet address
 * FIX: Sebelumnya mungkin query memakai user.id, sekarang pakai wallet_address
 */
export async function getUserBalance(walletAddress: string): Promise<number> {
  if (!walletAddress) {
    console.warn("walletAddress kosong");
    return 0;
  }

  // Coba query tabel "profiles" atau "users" — sesuaikan nama tabel dengan project kamu
  // Kemungkinan 1: tabel bernama "profiles"
  const { data, error } = await supabase
    .from("profiles")
    .select("balance, coin, coins, amount") // coba semua kemungkinan nama kolom
    .eq("wallet_address", walletAddress.toLowerCase()) // pakai lowercase untuk konsistensi
    .maybeSingle();

  if (error) {
    console.error("Error cek balance:", error.message);
    return 0;
  }

  if (!data) {
    console.warn("User tidak ditemukan di database untuk wallet:", walletAddress);
    // Jika user belum ada di DB, buat record baru dengan balance 0
    await createUserProfile(walletAddress);
    return 0;
  }

  // Ambil nilai dari kolom mana pun yang ada nilainya
  const balance = data.balance ?? data.coin ?? data.coins ?? data.amount ?? 0;
  return Number(balance);
}

/**
 * Buat profil user baru saat pertama kali connect wallet
 */
export async function createUserProfile(walletAddress: string) {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        wallet_address: walletAddress.toLowerCase(),
        balance: 0,
        created_at: new Date().toISOString(),
      },
      { onConflict: "wallet_address" }
    );

  if (error) {
    console.error("Gagal buat profil user:", error.message);
  }
}

/**
 * Cek apakah user punya cukup koin untuk membeli asset
 * FIX: Ini yang harusnya menggantikan logika "user no have coin on wallet"
 */
export async function hasEnoughBalance(
  walletAddress: string,
  requiredAmount: number
): Promise<{ sufficient: boolean; balance: number }> {
  const balance = await getUserBalance(walletAddress);

  return {
    sufficient: balance >= requiredAmount,
    balance,
  };
}

/**
 * Kurangi balance user setelah pembelian berhasil
 */
export async function deductBalance(
  walletAddress: string,
  amount: number
): Promise<boolean> {
  const currentBalance = await getUserBalance(walletAddress);

  if (currentBalance < amount) {
    throw new Error(`Saldo tidak cukup. Saldo: ${currentBalance}, Dibutuhkan: ${amount}`);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ balance: currentBalance - amount })
    .eq("wallet_address", walletAddress.toLowerCase());

  if (error) {
    console.error("Gagal kurangi balance:", error.message);
    return false;
  }

  return true;
}
