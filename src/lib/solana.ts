import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

export const SOLANA_NETWORK: "devnet" | "mainnet-beta" = "devnet";

let _connection: Connection | undefined;
export function getConnection() {
  if (!_connection) _connection = new Connection(clusterApiUrl(SOLANA_NETWORK), "confirmed");
  return _connection;
}

/** @deprecated use getConnection() */
export const connection = typeof window !== "undefined" ? getConnection() : (null as unknown as Connection);

export type PhantomProvider = {
  isPhantom?: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signMessage: (msg: Uint8Array, encoding?: string) => Promise<{ signature: Uint8Array }>;
  signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  removeAllListeners?: () => void;
};

export function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { phantom?: { solana?: PhantomProvider }; solana?: PhantomProvider };
  const p = w.phantom?.solana ?? w.solana;
  if (!p?.isPhantom) return null;
  return p;
}

export function waitForPhantom(timeoutMs = 3000): Promise<PhantomProvider | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const existing = getPhantom();
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const done = () => resolve(getPhantom());

    window.addEventListener("phantom#initialized", done, { once: true });

    const interval = setInterval(() => {
      if (getPhantom()) {
        clearInterval(interval);
        window.removeEventListener("phantom#initialized", done);
        resolve(getPhantom());
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      window.removeEventListener("phantom#initialized", done);
      resolve(getPhantom());
    }, timeoutMs);
  });
}

export async function getBalance(address: string): Promise<number> {
  try {
    const lamports = await getConnection().getBalance(new PublicKey(address));
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export async function sendSol(opts: {
  from: PhantomProvider;
  toAddress: string;
  amountSol: number;
}): Promise<string> {
  const { from, toAddress, amountSol } = opts;
  if (!from.publicKey) throw new Error("Wallet not connected");
  const toPubkey = new PublicKey(toAddress);
  const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

  const { blockhash } = await getConnection().getLatestBlockhash();
  const tx = new Transaction({ recentBlockhash: blockhash, feePayer: from.publicKey }).add(
    SystemProgram.transfer({ fromPubkey: from.publicKey, toPubkey, lamports })
  );

  const { signature } = await from.signAndSendTransaction(tx);
  await getConnection().confirmTransaction(signature, "confirmed");
  return signature;
}

export function shortAddress(addr: string, chars = 4): string {
  if (!addr) return "";
  return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}
