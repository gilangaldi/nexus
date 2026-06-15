import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_ASSETS, filterDemoAssets, getDemoAsset } from "@/lib/demo-assets";
import type { AssetRow } from "@/lib/asset-types";

export type { AssetRow };

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, name, description, icon, sort_order")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    } catch (e) {
      console.error("[categoriesQuery]", e);
      return [];
    }
  },
});

const assetSelect = `
  id, slug, title, description, thumbnail_url, preview_urls,
  price_sol, rating_avg, rating_count, downloads_count, tags, featured, created_at,
  seller_id, category_id,
  category:categories(name, slug),
  seller:profiles!assets_seller_profile_fkey(username, avatar_url)
`;

export function assetsQuery(params: { category?: string; search?: string; sort?: string } = {}) {
  return queryOptions({
    queryKey: ["assets", params],
    queryFn: async () => {
      try {
      let q = supabase.from("assets").select(assetSelect).eq("status", "approved");
      if (params.search) q = q.ilike("title", `%${params.search}%`);
      if (params.category) {
        const { data: cat } = await supabase.from("categories").select("id").eq("slug", params.category).maybeSingle();
        if (cat) q = q.eq("category_id", cat.id);
      }
      if (params.sort === "popular") q = q.order("downloads_count", { ascending: false });
      else if (params.sort === "rating") q = q.order("rating_avg", { ascending: false });
      else q = q.order("created_at", { ascending: false });
      const { data, error } = await q.limit(48);
      if (error) throw error;
      const rows = (data ?? []) as unknown as AssetRow[];
      return rows.length > 0 ? rows : filterDemoAssets(params);
    } catch (e) {
      console.error("[assetsQuery]", e);
      return filterDemoAssets(params);
    }
    },
  });
}

export const featuredAssetsQuery = queryOptions({
  queryKey: ["assets", "featured"],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from("assets")
        .select(assetSelect)
        .eq("status", "approved")
        .eq("featured", true)
        .limit(8);
      if (error) throw error;
      const rows = (data ?? []) as unknown as AssetRow[];
      return rows.length > 0 ? rows : DEMO_ASSETS.filter((a) => a.featured);
    } catch (e) {
      console.error("[featuredAssetsQuery]", e);
      return DEMO_ASSETS.filter((a) => a.featured);
    }
  },
});

export function assetBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: ["asset", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("assets").select(assetSelect).eq("slug", slug).maybeSingle();
      if (error) throw error;
      const row = data as unknown as AssetRow | null;
      return row ?? getDemoAsset(slug);
    },
  });
}

export const marketplaceStatsQuery = queryOptions({
  queryKey: ["stats"],
  queryFn: async () => {
    try {
      const [assets, creators, txs] = await Promise.all([
        supabase.from("assets").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("amount_sol").eq("status", "confirmed"),
      ]);
      const volume = (txs.data ?? []).reduce((s, t) => s + Number(t.amount_sol || 0), 0);
      const assetCount = assets.count ?? 0;
      const useDemo = assetCount === 0;
      return {
        assets: useDemo ? DEMO_ASSETS.length : assetCount,
        creators: useDemo ? 3 : (creators.count ?? 0),
        transactions: useDemo ? 47 : (txs.data?.length ?? 0),
        volume: useDemo ? 12.4 : volume,
      };
    } catch (e) {
      console.error("[marketplaceStatsQuery]", e);
      return { assets: DEMO_ASSETS.length, creators: 3, transactions: 47, volume: 12.4 };
    }
  },
});
