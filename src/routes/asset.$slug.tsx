import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Star, Download, Heart, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { assetBySlugQuery } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { usePhantomWallet } from "@/hooks/use-wallet";
import { supabase } from "@/integrations/supabase/client";
import { sendSol } from "@/lib/solana";
import { toast } from "sonner";

export const Route = createFileRoute("/asset/$slug")({
  loader: async ({ context, params }) => {
    const asset = await context.queryClient.ensureQueryData(assetBySlugQuery(params.slug));
    if (!asset) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — NEXUS` },
      { name: "description", content: "Premium game asset on NEXUS marketplace." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-xl font-semibold">Couldn't load asset</h1>
      <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Asset not found</h1>
      <Button asChild className="mt-4" variant="outline"><Link to="/marketplace">Back to marketplace</Link></Button>
    </div>
  ),
  component: AssetDetail,
});

function AssetDetail() {
  const { slug } = Route.useParams();
  const { data: asset } = useSuspenseQuery(assetBySlugQuery(slug));
  const { user } = useAuth();
  const wallet = usePhantomWallet();
  const [busy, setBusy] = useState(false);

  // Check ownership
  const { data: owned } = useQuery({
    queryKey: ["ownership", asset?.id, user?.id],
    enabled: !!asset && !!user,
    queryFn: async () => {
      const { data } = await supabase.from("asset_ownership").select("id").eq("asset_id", asset!.id).eq("user_id", user!.id).maybeSingle();
      return !!data;
    },
  });

  // Get seller's wallet
  const { data: sellerWallet } = useQuery({
    queryKey: ["seller-wallet", asset?.seller_id],
    enabled: !!asset?.seller_id,
    queryFn: async () => {
      const { data } = await supabase.from("wallets").select("address").eq("user_id", asset!.seller_id).eq("is_primary", true).maybeSingle();
      return data?.address ?? null;
    },
  });

  if (!asset) return null;

  async function handleBuy() {
    if (!user) { toast.error("Please sign in to buy."); return; }
    if (!wallet.address || !wallet.provider) {
      try { await wallet.connect(); } catch { toast.error("Connect your Phantom wallet first."); return; }
    }
    if (!sellerWallet) { toast.error("Seller has no wallet on file."); return; }
    setBusy(true);
    try {
      const sig = await sendSol({ from: wallet.provider!, toAddress: sellerWallet, amountSol: Number(asset!.price_sol) });
      // Record transaction & ownership
      const { data: tx, error: txErr } = await supabase.from("transactions").insert({
        buyer_id: user.id,
        seller_id: asset!.seller_id,
        asset_id: asset!.id,
        amount_sol: asset!.price_sol,
        tx_signature: sig,
        status: "confirmed",
        buyer_wallet: wallet.address!,
        seller_wallet: sellerWallet,
      }).select("id").single();
      if (txErr) throw txErr;
      await supabase.from("asset_ownership").insert({ user_id: user.id, asset_id: asset!.id, transaction_id: tx.id });
      toast.success("Purchase complete! Asset added to your library.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Purchase failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleWishlist() {
    if (!user) { toast.error("Sign in to use wishlist."); return; }
    const { error } = await supabase.from("wishlist").insert({ user_id: user.id, asset_id: asset!.id });
    if (error) toast.error(error.message); else toast.success("Added to wishlist");
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl overflow-hidden border border-border/60 bg-card aspect-video">
            <img src={asset.thumbnail_url} alt={asset.title} className="size-full object-cover" />
          </div>
          {asset.preview_urls?.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {asset.preview_urls.slice(0, 8).map((u, i) => (
                <img key={i} src={u} alt="" loading="lazy" className="rounded-md border border-border/60 aspect-square object-cover" />
              ))}
            </div>
          )}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="font-semibold mb-2">About this asset</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{asset.description}</p>
            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {asset.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            {asset.category && <Badge variant="outline">{asset.category.name}</Badge>}
            <h1 className="text-2xl font-bold tracking-tight">{asset.title}</h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="size-3 fill-current" />{asset.rating_avg.toFixed(1)} ({asset.rating_count})</span>
              <span className="flex items-center gap-1"><Download className="size-3" />{asset.downloads_count}</span>
            </div>
            <Separator />
            <div>
              <div className="text-xs text-muted-foreground">Price</div>
              <div className="font-display text-3xl font-bold gradient-text">{asset.price_sol} SOL</div>
            </div>

            {owned ? (
              <Button className="w-full" size="lg" variant="gradient" asChild>
                <a href={asset.preview_urls[0] ?? "#"} target="_blank" rel="noreferrer">
                  <Download className="size-4" /> Download
                </a>
              </Button>
            ) : (
              <Button className="w-full" size="lg" variant="hero" disabled={busy} onClick={handleBuy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                {busy ? "Processing…" : "Buy with Phantom"}
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={handleWishlist}>
              <Heart className="size-4" /> Add to wishlist
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground rounded-md bg-secondary/40 p-3">
              <ShieldCheck className="size-4 mt-0.5 text-primary shrink-0" />
              <span>On-chain proof of purchase. Re-download anytime from your library.</span>
            </div>
          </div>

          {asset.seller && (
            <Link
              to="/profile"
              className="block rounded-xl border border-border/60 bg-card p-4 card-hover"
            >
              <div className="flex items-center gap-3">
                <Avatar><AvatarImage src={asset.seller.avatar_url ?? undefined} /><AvatarFallback>{asset.seller.username[0]?.toUpperCase()}</AvatarFallback></Avatar>
                <div>
                  <div className="text-xs text-muted-foreground">Creator</div>
                  <div className="font-semibold text-sm">@{asset.seller.username}</div>
                </div>
              </div>
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
