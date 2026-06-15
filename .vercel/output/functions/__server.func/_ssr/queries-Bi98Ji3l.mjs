import "../_runtime.mjs";
import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-B46GVge8.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./button-PJ5WWh09.mjs";
import { t as queryOptions } from "../_libs/tanstack__react-query.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var thumb = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80";
var DEMO_ASSETS = [
	{
		id: "demo-1",
		slug: "cyber-samurai-character",
		title: "Cyber Samurai Character",
		description: "Low-poly sci-fi warrior with PBR textures, rigged for Unity & Unreal.",
		thumbnail_url: thumb,
		preview_urls: [thumb],
		price_sol: 2.5,
		rating_avg: 4.8,
		rating_count: 24,
		downloads_count: 156,
		tags: [
			"character",
			"sci-fi",
			"rigged"
		],
		featured: true,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		seller_id: "demo-seller",
		category_id: null,
		category: {
			name: "Characters",
			slug: "characters"
		},
		seller: {
			username: "nexus_studio",
			avatar_url: null
		}
	},
	{
		id: "demo-2",
		slug: "neon-city-environment",
		title: "Neon City Environment Pack",
		description: "Modular cyberpunk city blocks, streets, and lighting kit.",
		thumbnail_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
		preview_urls: [],
		price_sol: 4.2,
		rating_avg: 4.6,
		rating_count: 18,
		downloads_count: 89,
		tags: ["environment", "cyberpunk"],
		featured: true,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		seller_id: "demo-seller",
		category_id: null,
		category: {
			name: "Environments",
			slug: "environments"
		},
		seller: {
			username: "levelforge",
			avatar_url: null
		}
	},
	{
		id: "demo-3",
		slug: "combat-sfx-bundle",
		title: "Combat SFX Bundle",
		description: "120+ punch, sword, and explosion sound effects for action games.",
		thumbnail_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80",
		preview_urls: [],
		price_sol: .8,
		rating_avg: 4.9,
		rating_count: 42,
		downloads_count: 312,
		tags: [
			"audio",
			"sfx",
			"combat"
		],
		featured: true,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		seller_id: "demo-seller",
		category_id: null,
		category: {
			name: "Audio",
			slug: "audio"
		},
		seller: {
			username: "soundlab",
			avatar_url: null
		}
	},
	{
		id: "demo-4",
		slug: "fantasy-ui-kit",
		title: "Fantasy RPG UI Kit",
		description: "Complete HUD, inventory, and menu assets in PSD + PNG.",
		thumbnail_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
		preview_urls: [],
		price_sol: 1.5,
		rating_avg: 4.5,
		rating_count: 11,
		downloads_count: 67,
		tags: [
			"ui",
			"rpg",
			"fantasy"
		],
		featured: true,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		seller_id: "demo-seller",
		category_id: null,
		category: {
			name: "UI Kits",
			slug: "ui-kits"
		},
		seller: {
			username: "pixelcraft",
			avatar_url: null
		}
	}
];
function getDemoAsset(slug) {
	return DEMO_ASSETS.find((a) => a.slug === slug) ?? null;
}
function filterDemoAssets(params = {}) {
	let list = [...DEMO_ASSETS];
	if (params.search) {
		const q = params.search.toLowerCase();
		list = list.filter((a) => a.title.toLowerCase().includes(q));
	}
	if (params.category) list = list.filter((a) => a.category?.slug === params.category);
	return list;
}
var categoriesQuery = queryOptions({
	queryKey: ["categories"],
	queryFn: async () => {
		const { data, error } = await supabase.from("categories").select("id, slug, name, description, icon, sort_order").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var assetSelect = `
  id, slug, title, description, thumbnail_url, preview_urls,
  price_sol, rating_avg, rating_count, downloads_count, tags, featured, created_at,
  seller_id, category_id,
  category:categories(name, slug),
  seller:profiles!assets_seller_profile_fkey(username, avatar_url)
`;
function assetsQuery(params = {}) {
	return queryOptions({
		queryKey: ["assets", params],
		queryFn: async () => {
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
			const rows = data ?? [];
			return rows.length > 0 ? rows : filterDemoAssets(params);
		}
	});
}
var featuredAssetsQuery = queryOptions({
	queryKey: ["assets", "featured"],
	queryFn: async () => {
		const { data, error } = await supabase.from("assets").select(assetSelect).eq("status", "approved").eq("featured", true).limit(8);
		if (error) throw error;
		const rows = data ?? [];
		return rows.length > 0 ? rows : DEMO_ASSETS.filter((a) => a.featured);
	}
});
function assetBySlugQuery(slug) {
	return queryOptions({
		queryKey: ["asset", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("assets").select(assetSelect).eq("slug", slug).maybeSingle();
			if (error) throw error;
			return data ?? getDemoAsset(slug);
		}
	});
}
var marketplaceStatsQuery = queryOptions({
	queryKey: ["stats"],
	queryFn: async () => {
		const [assets, creators, txs] = await Promise.all([
			supabase.from("assets").select("id", {
				count: "exact",
				head: true
			}).eq("status", "approved"),
			supabase.from("profiles").select("id", {
				count: "exact",
				head: true
			}),
			supabase.from("transactions").select("amount_sol").eq("status", "confirmed")
		]);
		const volume = (txs.data ?? []).reduce((s, t) => s + Number(t.amount_sol || 0), 0);
		const assetCount = assets.count ?? 0;
		const useDemo = assetCount === 0;
		return {
			assets: useDemo ? DEMO_ASSETS.length : assetCount,
			creators: useDemo ? 3 : creators.count ?? 0,
			transactions: useDemo ? 47 : txs.data?.length ?? 0,
			volume: useDemo ? 12.4 : volume
		};
	}
});
//#endregion
export { featuredAssetsQuery as a, categoriesQuery as i, assetBySlugQuery as n, marketplaceStatsQuery as o, assetsQuery as r, Badge as t };
