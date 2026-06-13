import { Link } from "@tanstack/react-router";
import { Star, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AssetCardData {
  id: string;
  slug: string;
  title: string;
  thumbnail_url: string;
  price_sol: number;
  rating_avg: number;
  rating_count: number;
  downloads_count: number;
  category?: { name: string; slug: string } | null;
  seller?: { username: string; avatar_url?: string | null } | null;
}

export function AssetCard({ asset }: { asset: AssetCardData }) {
  return (
    <Link
      to="/asset/$slug"
      params={{ slug: asset.slug }}
      className="group block rounded-xl border border-border/60 bg-card overflow-hidden card-hover"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <img
          src={asset.thumbnail_url}
          alt={asset.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {asset.category && (
          <Badge className="absolute top-2 left-2 glass border-0 text-xs">{asset.category.name}</Badge>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm leading-tight line-clamp-1">{asset.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">@{asset.seller?.username ?? "unknown"}</span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1"><Star className="size-3 fill-current" />{asset.rating_avg.toFixed(1)}</span>
            <span className="flex items-center gap-1"><Download className="size-3" />{asset.downloads_count}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-sm font-semibold gradient-text">{asset.price_sol} SOL</span>
        </div>
      </div>
    </Link>
  );
}
