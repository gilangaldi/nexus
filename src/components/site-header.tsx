import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, LogOut, User as UserIcon, Library, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { usePhantomWallet } from "@/hooks/use-wallet";
import { supabase } from "@/integrations/supabase/client";
import { shortAddress } from "@/lib/solana";
import { toast } from "sonner";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight">
      <div className="size-7 rounded-md grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
        <span className="text-white text-sm">N</span>
      </div>
      <span>NEXUS</span>
    </Link>
  );
}

export function SiteHeader() {
  const { user } = useAuth();
  const wallet = usePhantomWallet();
  const [open, setOpen] = useState(false);

  async function handleConnect() {
    try {
      await wallet.connect();
      toast.success("Wallet terhubung");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal connect wallet");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  const walletLabel = wallet.connecting
    ? "Connecting…"
    : wallet.installed === false
      ? "Install Phantom"
      : "Connect Wallet";

  const nav = (
    <>
      <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Marketplace</Link>
      <Link to="/marketplace" search={{ category: "characters" }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
      <Link to="/sell" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sell</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">{nav}</nav>
        </div>
        <div className="flex items-center gap-2">
          {wallet.address ? (
            <Badge variant="secondary" className="hidden sm:inline-flex gap-1.5 font-mono text-xs h-8 px-3">
              <Wallet className="size-3" />
              {shortAddress(wallet.address)}
              {wallet.balance !== null && <span className="text-muted-foreground">· {wallet.balance.toFixed(2)} SOL</span>}
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnect}
              disabled={wallet.connecting || wallet.installed === null}
              className="hidden sm:inline-flex gap-2"
            >
              <Wallet className="size-4" />
              {walletLabel}
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                  <Avatar className="size-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{user.email?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/library"><Library className="size-4 mr-2" />Library</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile"><UserIcon className="size-4 mr-2" />Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/sell"><LayoutDashboard className="size-4 mr-2" />Seller Dashboard</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}><LogOut className="size-4 mr-2" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="gradient">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen(v => !v)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 px-4 py-3 flex flex-col gap-3">
          {nav}
          {!wallet.address && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnect}
              disabled={wallet.connecting || wallet.installed === null}
              className="gap-2 justify-start"
            >
              <Wallet className="size-4" /> {walletLabel}
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
