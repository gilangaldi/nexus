import { o as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as cn } from "./button-PJ5WWh09.mjs";
import { n as Image, r as Root, t as Fallback } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as Transaction, i as SystemProgram, n as LAMPORTS_PER_SOL, o as clusterApiUrl, r as PublicKey, t as Connection } from "../_libs/@solana/web3.js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-wallet-b_yeRl6r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Root.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = Image.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = Fallback.displayName;
var SOLANA_NETWORK = "devnet";
var _connection;
function getConnection() {
	if (!_connection) _connection = new Connection(clusterApiUrl(SOLANA_NETWORK), "confirmed");
	return _connection;
}
typeof window !== "undefined" && getConnection();
function getPhantom() {
	if (typeof window === "undefined") return null;
	const w = window;
	const p = w.phantom?.solana ?? w.solana;
	if (!p?.isPhantom) return null;
	return p;
}
function waitForPhantom(timeoutMs = 3e3) {
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
async function sendSol(opts) {
	const { from, toAddress, amountSol } = opts;
	if (!from.publicKey) throw new Error("Wallet not connected");
	const toPubkey = new PublicKey(toAddress);
	const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
	const { blockhash } = await getConnection().getLatestBlockhash();
	const tx = new Transaction({
		recentBlockhash: blockhash,
		feePayer: from.publicKey
	}).add(SystemProgram.transfer({
		fromPubkey: from.publicKey,
		toPubkey,
		lamports
	}));
	const { signature } = await from.signAndSendTransaction(tx);
	await getConnection().confirmTransaction(signature, "confirmed");
	return signature;
}
function shortAddress(addr, chars = 4) {
	if (!addr) return "";
	return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}
function withTimeout(promise, ms, message) {
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(new Error(message)), ms);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
function usePhantomWallet() {
	const [provider, setProvider] = (0, import_react.useState)(null);
	const [address, setAddress] = (0, import_react.useState)(null);
	const [balance, setBalance] = (0, import_react.useState)(null);
	const [connecting, setConnecting] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function init() {
			const p = await waitForPhantom(5e3);
			if (cancelled) return;
			setProvider(p);
			setReady(true);
			if (!p) return;
			try {
				setAddress((await withTimeout(p.connect({ onlyIfTrusted: true }), 5e3, "Silent reconnect timed out")).publicKey.toString());
			} catch {}
			const handleConnect = () => {
				if (p.publicKey) setAddress(p.publicKey.toString());
			};
			const handleDisconnect = () => setAddress(null);
			p.on("connect", handleConnect);
			p.on("disconnect", handleDisconnect);
		}
		init();
		return () => {
			cancelled = true;
		};
	}, []);
	return {
		provider,
		address,
		balance,
		connecting,
		ready,
		connect: (0, import_react.useCallback)(async () => {
			const p = provider ?? await waitForPhantom(3e3);
			if (!p) {
				window.open("https://phantom.app/download", "_blank", "noopener");
				throw new Error("Phantom wallet tidak terdeteksi. Install Phantom lalu refresh halaman.");
			}
			setConnecting(true);
			try {
				const { publicKey } = await withTimeout(p.connect(), 6e4, "Koneksi wallet timeout. Buka popup Phantom dan klik Connect.");
				setProvider(p);
				const addr = publicKey.toString();
				setAddress(addr);
				return {
					provider: p,
					address: addr
				};
			} finally {
				setConnecting(false);
			}
		}, [provider]),
		disconnect: (0, import_react.useCallback)(async () => {
			if (provider) await provider.disconnect();
			setAddress(null);
		}, [provider]),
		installed: ready ? !!provider : null
	};
}
//#endregion
export { shortAddress as a, sendSol as i, AvatarFallback as n, usePhantomWallet as o, AvatarImage as r, Avatar as t };
