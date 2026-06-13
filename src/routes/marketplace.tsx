import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AssetCard } from "@/components/asset-card";
import { assetsQuery, categoriesQuery } from "@/lib/queries";

const searchSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "popular", "rating"]).optional(),
});

export const Route = createFileRoute("/marketplace")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(assetsQuery(deps)),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Marketplace — NEXUS" },
      { name: "description", content: "Browse premium game assets on NEXUS. Filter by category, price, and popularity." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: assets } = useSuspenseQuery(assetsQuery(search));

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">Discover premium assets from creators worldwide.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search assets…"
              className="pl-9 h-10"
              defaultValue={search.search ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value;
                  navigate({ search: { ...search, search: v || undefined } });
                }
              }}
            />
          </div>
          <Select
            value={search.sort ?? "newest"}
            onValueChange={(v) => navigate({ search: { ...search, sort: v as "newest" | "popular" | "rating" } })}
          >
            <SelectTrigger className="w-36 h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link to="/marketplace" search={{}}>
          <Badge variant={!search.category ? "default" : "outline"} className="cursor-pointer">All</Badge>
        </Link>
        {categories.map(c => (
          <Link key={c.id} to="/marketplace" search={{ ...search, category: c.slug }}>
            <Badge variant={search.category === c.slug ? "default" : "outline"} className="cursor-pointer">{c.name}</Badge>
          </Link>
        ))}
      </div>

      {assets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-16 text-center">
          <div className="text-sm text-muted-foreground">No assets match your filters yet.</div>
          <Button asChild className="mt-4" variant="gradient" size="sm">
            <Link to="/sell">Be the first to publish</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map(a => <AssetCard key={a.id} asset={a} />)}
        </div>
      )}
    </div>
  );
}
