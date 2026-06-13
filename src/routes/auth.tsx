import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mail, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { usePhantomWallet } from "@/hooks/use-wallet";
import { signInWithWallet } from "@/lib/wallet-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Sign in — NEXUS" },
      { name: "description", content: "Sign in to NEXUS with email, Google, or your Solana wallet." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl">
          <div className="size-8 rounded-md grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
            <span className="text-white text-sm">N</span>
          </div>
          NEXUS
        </Link>
        <h1 className="text-2xl font-bold mt-6">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account or connect your wallet</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6">
        <SocialAndWallet />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or with email</span></div>
        </div>
        <EmailForm />
      </div>
    </div>
  );
}

function SocialAndWallet() {
  const wallet = usePhantomWallet();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);

  async function handleGoogle() {
    setBusy("google");
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
      else if (!r.redirected) { toast.success("Signed in"); navigate({ to: "/" }); }
    } finally { setBusy(null); }
  }

  async function handlePhantom() {
    setBusy("phantom");
    try {
      if (wallet.installed === false) {
        window.open("https://phantom.app/download", "_blank", "noopener");
        throw new Error("Install Phantom wallet dulu, lalu refresh halaman ini.");
      }
      const { provider, address } = await wallet.connect();
      await signInWithWallet(provider, address);
      toast.success("Login wallet berhasil");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Wallet sign-in gagal");
    } finally { setBusy(null); }
  }

  const phantomLabel = busy === "phantom"
    ? "Menghubungkan…"
    : wallet.installed === false
      ? "Install Phantom Wallet"
      : "Sign in with Phantom";

  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full justify-center gap-2" onClick={handleGoogle} disabled={!!busy}>
        {busy === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </Button>
      <Button variant="gradient" className="w-full justify-center gap-2" onClick={handlePhantom} disabled={!!busy || wallet.installed === null}>
        {busy === "phantom" ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}
        {phantomLabel}
      </Button>
      {wallet.installed === false && (
        <p className="text-xs text-muted-foreground text-center">
          Phantom belum terinstall. Klik tombol di atas untuk download.
        </p>
      )}
    </div>
  );
}

function EmailForm() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (tab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: "/" });
      } else {
        if (!username.trim()) throw new Error("Username is required");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username: username.trim(), full_name: fullName.trim() || undefined },
          },
        });
        if (error) throw error;

        if (data.session) {
          toast.success("Account created");
          navigate({ to: "/" });
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) {
          toast.success("Account created");
          navigate({ to: "/" });
          return;
        }

        toast.success("Account created — check your email to confirm, then sign in");
        setTab("signin");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Authentication failed");
    } finally { setBusy(false); }
  }

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={submit} className="space-y-3 mt-4">
          <div className="space-y-1.5">
            <Label htmlFor="signin-email">Email</Label>
            <Input id="signin-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signin-password">Password</Label>
            <Input id="signin-password" type="password" required minLength={6} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            Sign in
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={submit} className="space-y-3 mt-4">
          <div className="space-y-1.5">
            <Label htmlFor="signup-username">Username</Label>
            <Input id="signup-username" required minLength={3} autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signup-fullname">Full name <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="signup-fullname" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            Create account
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 7.1 29.4 5 24 5 16.3 5 9.7 9.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.2c-2 1.4-4.5 2.3-7.4 2.3-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.5l6.3 5.2c-.4.4 6.5-4.7 6.5-14.7 0-1.3-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
