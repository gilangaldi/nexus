import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Users, Package, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetCard } from "@/components/asset-card";
import { categoriesQuery, featuredAssetsQuery, marketplaceStatsQuery } from "@/lib/queries";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXUS — The Next Generation Game Asset Marketplace" },
      { name: "description", content: "Buy and sell premium game assets on Solana. Characters, environments, audio, scripts and more." },
      { property: "og:title", content: "NEXUS — Game Asset Marketplace on Solana" },
      { property: "og:description", content: "Premium game assets, paid in SOL. Built for creators." },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(featuredAssetsQuery),
      context.queryClient.ensureQueryData(marketplaceStatsQuery),
    ]);
  },
  component: Home,
});

function Home() {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: featured } = useSuspenseQuery(featuredAssetsQuery);
  const { data: stats } = useSuspenseQuery(marketplaceStatsQuery);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} aria-hidden />
        <div className="container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground glass">
              <Sparkles className="size-3" /> Powered by Solana · Devnet
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              The next generation <br />
              <span className="gradient-text">game asset marketplace</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Buy and sell premium game assets on Solana. From characters and environments to scripts and SFX — all paid instantly in SOL.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" variant="hero">
                <Link to="/marketplace">Explore Assets <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/sell">Start Selling</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-border/60 overflow-hidden glass" style={{ boxShadow: "var(--shadow-soft)" }}>
            <img src={heroImg} alt="NEXUS marketplace preview" width={1920} height={1080} className="w-full" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={<Package className="size-5" />} label="Total Assets" value={stats.assets.toLocaleString()} />
          <Stat icon={<Users className="size-5" />} label="Creators" value={stats.creators.toLocaleString()} />
          <Stat icon={<TrendingUp className="size-5" />} label="Transactions" value={stats.transactions.toLocaleString()} />
          <Stat icon={<Coins className="size-5" />} label="Volume" value={`${stats.volume.toFixed(2)} SOL`} />
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <SectionHeader title="Browse by category" subtitle="Find exactly what your game needs" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/marketplace"
              search={{ category: c.slug }}
              className="group rounded-xl border border-border/60 bg-card p-5 card-hover"
            >
              <div className="size-10 rounded-lg grid place-items-center mb-3 bg-secondary/60 text-primary group-hover:scale-110 transition-transform">
                <Zap className="size-5" />
              </div>
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-12">
        <SectionHeader title="Featured assets" subtitle="Curated by the NEXUS team" cta={{ to: "/marketplace", label: "View all" }} />
        {featured.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {featured.map(a => <AssetCard key={a.id} asset={a} />)}
          </div>
        )}
      </section>

      {/* Value props */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <Value icon={<Zap />} title="Instant SOL payments" body="Transactions settle in under a second. No middlemen, no chargebacks." />
          <Value icon={<Shield />} title="Verified ownership" body="On-chain proof of purchase. Re-download anytime from your library." />
          <Value icon={<Sparkles />} title="Built for creators" body="Keep 95% of every sale. Upload, price in SOL, get paid directly." />
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">{icon}<span>{label}</span></div>
      <div className="mt-2 text-2xl font-display font-bold">{value}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {cta && (
        <Link to={cta.to} className="text-sm text-primary hover:underline shrink-0">{cta.label} →</Link>
      )}
    </div>
  );
}

function Value({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="size-10 rounded-lg grid place-items-center bg-secondary/60 text-primary mb-4">{icon}</div>
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-muted-foreground mt-1">{body}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-xl border border-dashed border-border/60 p-12 text-center">
      <div className="text-sm text-muted-foreground">No featured assets yet — be the first creator to publish.</div>
      <Button asChild className="mt-4" variant="gradient" size="sm">
        <Link to="/sell">Start Selling</Link>
      </Button>
    </div>
  );
}
