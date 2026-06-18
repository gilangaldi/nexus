// src/components/BuyAssetButton.tsx
// Gantikan logika pembelian yang error "user no have coin on wallet"

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hasEnoughBalance, deductBalance } from "@/utils/walletBalance";

interface BuyAssetButtonProps {
  assetId: string;
  assetPrice: number;
  sellerWallet: string;
  onSuccess?: () => void;
}

export function BuyAssetButton({
  assetId,
  assetPrice,
  sellerWallet,
  onSuccess,
}: BuyAssetButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    setError(null);
    setLoading(true);

    try {
      // Ambil wallet address dari context/state global (sesuaikan dengan cara kamu simpan)
      // Ini contoh — ganti dengan cara kamu mengambil wallet address yang sudah connect
      const walletAddress = (window as any).__connectedWallet as string;

      if (!walletAddress) {
        throw new Error("Wallet belum terkoneksi. Silakan connect wallet terlebih dahulu.");
      }

      // FIX: Cek balance dengan benar menggunakan wallet_address
      const { sufficient, balance } = await hasEnoughBalance(walletAddress, assetPrice);

      if (!sufficient) {
        throw new Error(
          `Saldo tidak mencukupi. Saldo kamu: ${balance} coin, harga asset: ${assetPrice} coin.`
        );
      }

      // Kurangi balance pembeli
      await deductBalance(walletAddress, assetPrice);

      // Tambah balance penjual
      const { data: sellerData } = await supabase
        .from("profiles")
        .select("balance")
        .eq("wallet_address", sellerWallet.toLowerCase())
        .maybeSingle();

      const sellerBalance = sellerData?.balance ?? 0;
      await supabase
        .from("profiles")
        .upsert({
          wallet_address: sellerWallet.toLowerCase(),
          balance: sellerBalance + assetPrice,
        }, { onConflict: "wallet_address" });

      // Update asset jadi sold
      await supabase
        .from("assets")
        .update({ is_sold: true, buyer_wallet: walletAddress.toLowerCase() })
        .eq("id", assetId);

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat pembelian.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Beli Sekarang"}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
