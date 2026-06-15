import { o as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-mNz7SclJ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-PJ5WWh09.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as shortAddress, n as AvatarFallback, o as usePhantomWallet, r as AvatarImage, t as Avatar } from "./use-wallet-b_yeRl6r.mjs";
import { t as useAuth } from "./use-auth-Mz2IfLl9.mjs";
import { t as Separator } from "./separator-AyYFbXLQ.mjs";
import { C as Copy, k as Check, r as Wallet } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-DjPV9x--.mjs";
import { t as Label } from "./label-CEIUvAE7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CBmr4dyZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Profile() {
	const { user } = useAuth();
	const wallet = usePhantomWallet();
	const [username, setUsername] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const { data: profile, refetch } = useQuery({
		queryKey: ["profile", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
			return data;
		}
	});
	const { data: wallets = [], refetch: refetchWallets } = useQuery({
		queryKey: ["wallets", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("wallets").select("*").eq("user_id", user.id);
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		if (profile) {
			setUsername(profile.username ?? "");
			setFullName(profile.full_name ?? "");
			setBio(profile.bio ?? "");
		}
	}, [profile]);
	async function save() {
		const { error } = await supabase.from("profiles").update({
			username,
			full_name: fullName,
			bio
		}).eq("id", user.id);
		if (error) toast.error(error.message);
		else {
			toast.success("Profile saved");
			refetch();
		}
	}
	async function linkWallet() {
		try {
			const { address } = await wallet.connect();
			const { error } = await supabase.from("wallets").upsert({
				user_id: user.id,
				address,
				is_primary: wallets.length === 0
			}, { onConflict: "address" });
			if (error) throw error;
			toast.success("Wallet linked");
			refetchWallets();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Link failed");
		}
	}
	async function unlinkWallet(address) {
		const { error } = await supabase.from("wallets").delete().eq("address", address);
		if (error) toast.error(error.message);
		else {
			toast.success("Wallet unlinked");
			refetchWallets();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mx-auto px-4 py-10 max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Profile"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Manage your account and connected wallets."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/60 bg-card p-6 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "size-16",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: profile?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "text-lg",
								children: (profile?.username ?? "U")[0]?.toUpperCase()
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-semibold",
							children: ["@", profile?.username ?? "loading"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: user?.email
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Username" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: username,
								onChange: (e) => setUsername(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: fullName,
								onChange: (e) => setFullName(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: bio,
							onChange: (e) => setBio(e.target.value),
							placeholder: "Tell creators about yourself"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						variant: "gradient",
						children: "Save changes"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/60 bg-card p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Connected wallets"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Link a Solana wallet to buy and receive payments."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: linkWallet,
						variant: "outline",
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }), " Link wallet"]
					})]
				}), wallets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground",
					children: "No wallets linked yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: wallets.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-mono text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-primary" }),
								shortAddress(w.address, 6),
								w.is_primary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wide bg-primary/20 text-primary rounded px-1.5 py-0.5 ml-2",
									children: "Primary"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									navigator.clipboard.writeText(w.address);
									setCopied(true);
									setTimeout(() => setCopied(false), 1500);
								},
								children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => unlinkWallet(w.address),
								children: "Unlink"
							})]
						})]
					}, w.id))
				})]
			})
		]
	});
}
//#endregion
export { Profile as component };
