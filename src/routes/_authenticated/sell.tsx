import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Upload, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { randomId } from "@/lib/crypto-polyfill";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/sell")({
  head: () => ({ meta: [{ title: "Seller Dashboard — NEXUS" }] }),
  component: Sell,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) + "-" + Math.random().toString(36).slice(2, 7);
}

function extractStoragePath(url: string): string | null {
  const marker = "/storage/v1/object/public/nexus-assets/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", category_id: "", price_sol: "0.5", tags: "",
  });
  const [thumb, setThumb] = useState<File | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("id, name").order("sort_order")).data ?? [],
  });

  const { data: myAssets = [], refetch } = useQuery({
    queryKey: ["my-assets", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("assets").select("id, title, price_sol, status, downloads_count, thumbnail_url, slug").eq("seller_id", user!.id).order("created_at", { ascending: false })).data ?? [],
  });

  const { data: stats } = useQuery({
    queryKey: ["seller-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: txs } = await supabase.from("transactions").select("amount_sol").eq("seller_id", user!.id).eq("status", "confirmed");
      return {
        sales: txs?.length ?? 0,
        revenue: (txs ?? []).reduce((s, t) => s + Number(t.amount_sol || 0), 0),
      };
    },
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!thumb) { toast.error("Add a thumbnail image"); return; }
    setBusy(true);
    try {
      const ext = thumb.name.split(".").pop() ?? "jpg";
      const path = `${user!.id}/${randomId()}.${ext}`;
      const { data: up, error: upErr } = await supabase.storage.from("nexus-assets").upload(path, thumb, { cacheControl: "3600", upsert: false });
      if (upErr) {
        throw new Error(`Gagal upload gambar: ${upErr.message}. Pastikan bucket "nexus-assets" sudah dibuat di Supabase.`);
      }

      const thumbUrl = supabase.storage.from("nexus-assets").getPublicUrl(up.path).data.publicUrl;

      const slug = slugify(form.title);
      const { error } = await supabase.from("assets").insert({
        seller_id: user!.id,
        category_id: form.category_id || null,
        title: form.title,
        slug,
        description: form.description,
        thumbnail_url: thumbUrl,
        preview_urls: [],
        price_sol: Number(form.price_sol),
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        status: "approved",
      });
      if (error) throw error;

      await supabase.from("user_roles").upsert({ user_id: user!.id, role: "seller" }, { onConflict: "user_id,role" });

      toast.success("Asset published");
      setForm({ title: "", description: "", category_id: "", price_sol: "0.5", tags: "" });
      setThumb(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      navigate({ to: "/asset/$slug", params: { slug } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    } finally { setBusy(false); }
  }

  async function handleDelete(asset: { id: string; title: string; thumbnail_url: string }) {
    setDeletingId(asset.id);
    try {
      const storagePath = extractStoragePath(asset.thumbnail_url);
      if (storagePath) {
        await supabase.storage.from("nexus-assets").remove([storagePath]);
      }

      const { error } = await supabase.from("assets").delete().eq("id", asset.id);
      if (error) throw error;

      toast.success(`"${asset.title}" berhasil dihapus`);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus asset");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload assets and track your sales.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Assets" value={String(myAssets.length)} />
        <StatBox label="Sales" value={String(stats?.sales ?? 0)} />
        <StatBox label="Revenue" value={`${(stats?.revenue ?? 0).toFixed(2)} SOL`} />
        <StatBox label="Downloads" value={String(myAssets.reduce((s, a) => s + a.downloads_count, 0))} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
          <h2 className="font-semibold">Upload new asset</h2>
          <div className="space-y-1.5"><Label>Title</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm({ ...form, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Price (SOL)</Label><Input type="number" step="0.01" min="0" required value={form.price_sol} onChange={e => setForm({ ...form, price_sol: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="lowpoly, fantasy, rigged" /></div>
          <div className="space-y-1.5"><Label>Thumbnail</Label><Input type="file" accept="image/*" onChange={e => setThumb(e.target.files?.[0] ?? null)} /></div>
          <Button type="submit" variant="gradient" disabled={busy} className="w-full">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Publish asset
          </Button>
        </form>

        <div className="rounded-xl border border-border/60 bg-card p-6">
          <h2 className="font-semibold mb-4">Your assets</h2>
          {myAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assets yet — publish your first one.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {myAssets.map(a => (
                <li key={a.id} className="py-3 flex items-center gap-3">
                  <img src={a.thumbnail_url} alt="" className="size-12 rounded-md object-cover border border-border/60" />
                  <div className="flex-1 min-w-0">
                    <Link to="/asset/$slug" params={{ slug: a.slug }} className="font-medium text-sm hover:underline">{a.title}</Link>
                    <div className="text-xs text-muted-foreground">{a.status} · {a.downloads_count} downloads</div>
                  </div>
                  <div className="font-mono text-sm">{a.price_sol} SOL</div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive shrink-0"
                        disabled={deletingId === a.id}
                      >
                        {deletingId === a.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus asset?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Asset &quot;{a.title}&quot; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDelete(a)}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-display font-bold">{value}</div>
    </div>
  );
}
