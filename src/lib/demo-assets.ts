import type { AssetRow } from "@/lib/asset-types";

const thumb = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80";

export const DEMO_ASSETS: AssetRow[] = [
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
    tags: ["character", "sci-fi", "rigged"],
    featured: true,
    created_at: new Date().toISOString(),
    seller_id: "demo-seller",
    category_id: null,
    category: { name: "Characters", slug: "characters" },
    seller: { username: "nexus_studio", avatar_url: null },
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
    created_at: new Date().toISOString(),
    seller_id: "demo-seller",
    category_id: null,
    category: { name: "Environments", slug: "environments" },
    seller: { username: "levelforge", avatar_url: null },
  },
  {
    id: "demo-3",
    slug: "combat-sfx-bundle",
    title: "Combat SFX Bundle",
    description: "120+ punch, sword, and explosion sound effects for action games.",
    thumbnail_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80",
    preview_urls: [],
    price_sol: 0.8,
    rating_avg: 4.9,
    rating_count: 42,
    downloads_count: 312,
    tags: ["audio", "sfx", "combat"],
    featured: true,
    created_at: new Date().toISOString(),
    seller_id: "demo-seller",
    category_id: null,
    category: { name: "Audio", slug: "audio" },
    seller: { username: "soundlab", avatar_url: null },
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
    tags: ["ui", "rpg", "fantasy"],
    featured: true,
    created_at: new Date().toISOString(),
    seller_id: "demo-seller",
    category_id: null,
    category: { name: "UI Kits", slug: "ui-kits" },
    seller: { username: "pixelcraft", avatar_url: null },
  },
];

export function getDemoAsset(slug: string): AssetRow | null {
  return DEMO_ASSETS.find((a) => a.slug === slug) ?? null;
}

export function filterDemoAssets(params: { category?: string; search?: string } = {}) {
  let list = [...DEMO_ASSETS];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter((a) => a.title.toLowerCase().includes(q));
  }
  if (params.category) {
    list = list.filter((a) => a.category?.slug === params.category);
  }
  return list;
}
