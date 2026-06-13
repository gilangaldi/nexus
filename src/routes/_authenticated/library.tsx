import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({ meta: [{ title: "My Library — NEXUS" }] }),
  component: Library,
});

function Library() {
  const { user } = useAuth();
  const [q, setQ] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["library", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asset_ownership")
        .select("created_at, asset:assets(id, slug, title, thumbnail_url, price_sol, preview_urls)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = items.filter(i => !q || i.asset?.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
          <p className="text-sm text-muted-foreground mt-1">All your purchased assets, ready to download.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search library…" className="pl-9 h-10" />
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-16 text-center">
          <div className="text-sm text-muted-foreground">No assets yet. Discover something on the marketplace.</div>
          <Button asChild className="mt-4" variant="gradient" size="sm"><Link to="/marketplace">Browse marketplace</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((it, i) => it.asset && (
            <div key={i} className="rounded-xl border border-border/60 bg-card overflow-hidden">
              <Link to="/asset/$slug" params={{ slug: it.asset.slug }}>
                <img src={it.asset.thumbnail_url} alt={it.asset.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-sm">{it.asset.title}</h3>
                <Button asChild size="sm" variant="outline" className="mt-3 w-full">
                  <a href={it.asset.preview_urls?.[0] ?? "#"} target="_blank" rel="noreferrer">
                    <Download className="size-4" /> Download
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
