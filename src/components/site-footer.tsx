import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display font-bold tracking-tight">
            <div className="size-6 rounded-md grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
              <span className="text-white text-xs">N</span>
            </div>
            NEXUS
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            The next generation game asset marketplace, powered by Solana.
          </p>
        </div>
        <FooterCol title="Marketplace" links={[
          { label: "Browse all", to: "/marketplace" },
          { label: "Characters", to: "/marketplace", search: { category: "characters" } },
          { label: "3D Models", to: "/marketplace", search: { category: "3d-models" } },
          { label: "Audio", to: "/marketplace", search: { category: "audio" } },
        ]} />
        <FooterCol title="Creators" links={[
          { label: "Start selling", to: "/sell" },
          { label: "Library", to: "/library" },
          { label: "Profile", to: "/profile" },
        ]} />
        <FooterCol title="Platform" links={[
          { label: "Sign in", to: "/auth" },
        ]} />
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} NEXUS. Built on Solana.</span>
          <span>Network: Devnet</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string; search?: Record<string, string> }[] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map(l => (
          <li key={l.label}>
            <Link to={l.to} search={l.search as never} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
