import { supabase } from "@/integrations/supabase/client";
import type { PhantomProvider } from "@/lib/solana";
import { withTimeout } from "@/lib/async-utils";

export function walletCredentials(address: string) {
  const email = `${address.toLowerCase()}@wallet.nexus`;
  const password = `nx_wallet_${address}`;
  return { email, password };
}

async function supabaseAuthCall<T>(label: string, fn: () => Promise<T>): Promise<T> {
  return withTimeout(fn(), 20_000, `${label} timeout — cek koneksi internet & Supabase.`);
}

export async function signInWithWallet(_provider: PhantomProvider, address: string) {
  const { email, password } = walletCredentials(address);

  let signIn = await supabaseAuthCall("Login", () =>
    supabase.auth.signInWithPassword({ email, password }),
  );
  let userId = signIn.data.user?.id;

  if (signIn.error) {
    const signUp = await supabaseAuthCall("Register wallet", () =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            wallet_address: address,
            username: `sol_${address.slice(0, 6).toLowerCase()}`,
          },
        },
      }),
    );

    if (signUp.error && !signUp.error.message.toLowerCase().includes("already")) {
      throw new Error(signUp.error.message);
    }

    if (signUp.data.session?.user) {
      userId = signUp.data.session.user.id;
    } else {
      signIn = await supabaseAuthCall("Login setelah register", () =>
        supabase.auth.signInWithPassword({ email, password }),
      );
      if (signIn.error) {
        if (signIn.error.message.toLowerCase().includes("confirm")) {
          throw new Error(
            "Akun wallet dibuat tapi perlu konfirmasi email. Di Supabase Dashboard → Auth → matikan 'Confirm email', lalu coba lagi.",
          );
        }
        throw new Error(signIn.error.message);
      }
      userId = signIn.data.user?.id;
    }
  }

  if (userId) {
    const { error } = await supabase.from("wallets").upsert(
      { user_id: userId, address, is_primary: true },
      { onConflict: "address" },
    );
    if (error) console.warn("[wallet-auth] wallets upsert:", error.message);
  }

  return userId;
}
