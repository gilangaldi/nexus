import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Wallet, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { usePhantomWallet } from "@/hooks/use-wallet";
import { supabase } from "@/integrations/supabase/client";
import { shortAddress } from "@/lib/solana";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — NEXUS" }] }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  const wallet = usePhantomWallet();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: wallets = [], refetch: refetchWallets } = useQuery({
    queryKey: ["wallets", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("wallets").select("*").eq("user_id", user!.id);
      return data ?? [];
    },
  });

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setFullName(profile.full_name ?? "");
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  async function save() {
    const { error } = await supabase.from("profiles").update({ username, full_name: fullName, bio }).eq("id", user!.id);
    if (error) toast.error(error.message); else { toast.success("Profile saved"); refetch(); }
  }

  async function linkWallet() {
    try {
      const { address } = await wallet.connect();
      const { error } = await supabase.from("wallets").upsert(
        { user_id: user!.id, address, is_primary: wallets.length === 0 },
        { onConflict: "address" }
      );
      if (error) throw error;
      toast.success("Wallet linked");
      refetchWallets();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Link failed"); }
  }

  async function unlinkWallet(address: string) {
    const { error } = await supabase.from("wallets").delete().eq("address", address);
    if (error) toast.error(error.message); else { toast.success("Wallet unlinked"); refetchWallets(); }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and connected wallets.</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="text-lg">{(profile?.username ?? "U")[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">@{profile?.username ?? "loading"}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Username</Label><Input value={username} onChange={e => setUsername(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Full name</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} /></div>
        </div>
        <div className="space-y-1.5"><Label>Bio</Label><Input value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell creators about yourself" /></div>
        <Button onClick={save} variant="gradient">Save changes</Button>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Connected wallets</h2>
            <p className="text-xs text-muted-foreground">Link a Solana wallet to buy and receive payments.</p>
          </div>
          <Button onClick={linkWallet} variant="outline" size="sm"><Wallet className="size-4" /> Link wallet</Button>
        </div>

        {wallets.length === 0 ? (
          <div className="rounded-md border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">No wallets linked yet.</div>
        ) : (
          <ul className="space-y-2">
            {wallets.map(w => (
              <li key={w.id} className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2">
                <div className="flex items-center gap-2 font-mono text-sm">
                  <Wallet className="size-4 text-primary" />
                  {shortAddress(w.address, 6)}
                  {w.is_primary && <span className="text-[10px] uppercase tracking-wide bg-primary/20 text-primary rounded px-1.5 py-0.5 ml-2">Primary</span>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(w.address); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
                    {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => unlinkWallet(w.address)}>Unlink</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
