export type AssetRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  preview_urls: string[];
  price_sol: number;
  rating_avg: number;
  rating_count: number;
  downloads_count: number;
  tags: string[];
  featured: boolean;
  created_at: string;
  seller_id: string;
  category_id: string | null;
  category: { name: string; slug: string } | null;
  seller: { username: string; avatar_url: string | null } | null;
};
