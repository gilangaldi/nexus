import { useCallback, useEffect, useState } from "react";
import { getBalance, getPhantom, waitForPhantom, type PhantomProvider } from "@/lib/solana";
import { withTimeout } from "@/lib/async-utils";

export function usePhantomWallet() {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const p = await waitForPhantom(5000);
      if (cancelled) return;
      setProvider(p);
      setReady(true);
      if (!p) return;

      try {
        const res = await withTimeout(
          p.connect({ onlyIfTrusted: true }),
          5000,
          "Silent reconnect timed out",
        );
        setAddress(res.publicKey.toString());
      } catch {
        // User has not trusted this site yet — normal on first visit.
      }

      const handleConnect = () => {
        if (p.publicKey) setAddress(p.publicKey.toString());
      };
      const handleDisconnect = () => setAddress(null);
      p.on("connect", handleConnect);
      p.on("disconnect", handleDisconnect);
    }

    void init();
    return () => { cancelled = true; };
  }, []);

  const connect = useCallback(async () => {
    const p = provider ?? (await waitForPhantom(3000));
    if (!p) {
      window.open("https://phantom.app/download", "_blank", "noopener");
      throw new Error("Phantom wallet tidak terdeteksi. Install Phantom lalu refresh halaman.");
    }

    setConnecting(true);
    try {
      const { publicKey } = await withTimeout(
        p.connect(),
        60_000,
        "Koneksi wallet timeout. Buka popup Phantom dan klik Connect.",
      );
      setProvider(p);
      const addr = publicKey.toString();
      setAddress(addr);
      return { provider: p, address: addr };
    } finally {
      setConnecting(false);
    }
  }, [provider]);

  const disconnect = useCallback(async () => {
    if (provider) await provider.disconnect();
    setAddress(null);
  }, [provider]);

  return {
    provider,
    address,
    balance,
    connecting,
    ready,
    connect,
    disconnect,
    installed: ready ? !!provider : null,
  };
}
