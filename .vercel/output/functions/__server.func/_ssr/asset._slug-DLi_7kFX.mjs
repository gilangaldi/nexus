import { o as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-mNz7SclJ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-PJ5WWh09.mjs";
import { n as useSuspenseQuery, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as assetBySlugQuery, t as Badge } from "./queries-BnrFKWYr.mjs";
import { i as sendSol, n as AvatarFallback, o as usePhantomWallet, r as AvatarImage, t as Avatar } from "./use-wallet-b_yeRl6r.mjs";
import { t as useAuth } from "./use-auth-Mz2IfLl9.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./asset._slug-DGgbDnOn.mjs";
import { t as Separator } from "./separator-AyYFbXLQ.mjs";
import { S as Download, f as ShieldCheck, l as Star, v as LoaderCircle, x as Heart } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset._slug-DLi_7kFX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AssetDetail() {
	const { slug } = Route.useParams();
	const { data: asset } = useSuspenseQuery(assetBySlugQuery(slug));
	const { user } = useAuth();
	const wallet = usePhantomWallet();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: owned } = useQuery({
		queryKey: [
			"ownership",
			asset?.id,
			user?.id
		],
		enabled: !!asset && !!user,
		queryFn: async () => {
			const { data } = await supabase.from("asset_ownership").select("id").eq("asset_id", asset.id).eq("user_id", user.id).maybeSingle();
			return !!data;
		}
	});
	const { data: sellerWallet } = useQuery({
		queryKey: ["seller-wallet", asset?.seller_id],
		enabled: !!asset?.seller_id,
		queryFn: async () => {
			const { data } = await supabase.from("wallets").select("address").eq("user_id", asset.seller_id).eq("is_primary", true).maybeSingle();
			return data?.address ?? null;
		}
	});
	if (!asset) return null;
	async function handleBuy() {
		if (!user) {
			toast.error("Please sign in to buy.");
			return;
		}
		if (!wallet.address || !wallet.provider) try {
			await wallet.connect();
		} catch {
			toast.error("Connect your Phantom wallet first.");
			return;
		}
		if (!sellerWallet) {
			toast.error("Seller has no wallet on file.");
			return;
		}
		setBusy(true);
		try {
			const sig = await sendSol({
				from: wallet.provider,
				toAddress: sellerWallet,
				amountSol: Number(asset.price_sol)
			});
			const { data: tx, error: txErr } = await supabase.from("transactions").insert({
				buyer_id: user.id,
				seller_id: asset.seller_id,
				asset_id: asset.id,
				amount_sol: asset.price_sol,
				tx_signature: sig,
				status: "confirmed",
				buyer_wallet: wallet.address,
				seller_wallet: sellerWallet
			}).select("id").single();
			if (txErr) throw txErr;
			await supabase.from("asset_ownership").insert({
				user_id: user.id,
				asset_id: asset.id,
				transaction_id: tx.id
			});
			toast.success("Purchase complete! Asset added to your library.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Purchase failed");
		} finally {
			setBusy(false);
		}
	}
	async function handleWishlist() {
		if (!user) {
			toast.error("Sign in to use wishlist.");
			return;
		}
		const { error } = await supabase.from("wishlist").insert({
			user_id: user.id,
			asset_id: asset.id
		});
		if (error) toast.error(error.message);
		else toast.success("Added to wishlist");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container mx-auto px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-3 gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl overflow-hidden border border-border/60 bg-card aspect-video",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: asset.thumbnail_url,
							alt: asset.title,
							className: "size-full object-cover"
						})
					}),
					asset.preview_urls?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2",
						children: asset.preview_urls.slice(0, 8).map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: u,
							alt: "",
							loading: "lazy",
							className: "rounded-md border border-border/60 aspect-square object-cover"
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-card p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold mb-2",
								children: "About this asset"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground whitespace-pre-line",
								children: asset.description
							}),
							asset.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5 mt-4",
								children: asset.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "text-xs",
									children: t
								}, t))
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/60 bg-card p-6 space-y-4",
					children: [
						asset.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: asset.category.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold tracking-tight",
							children: asset.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }),
									asset.rating_avg.toFixed(1),
									" (",
									asset.rating_count,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), asset.downloads_count]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Price"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-3xl font-bold gradient-text",
							children: [asset.price_sol, " SOL"]
						})] }),
						owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							size: "lg",
							variant: "gradient",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: asset.preview_urls[0] ?? "#",
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download"]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full",
							size: "lg",
							variant: "hero",
							disabled: busy,
							onClick: handleBuy,
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, busy ? "Processing…" : "Buy with Phantom"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "w-full",
							onClick: handleWishlist,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4" }), " Add to wishlist"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 text-xs text-muted-foreground rounded-md bg-secondary/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 mt-0.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "On-chain proof of purchase. Re-download anytime from your library." })]
						})
					]
				}), asset.seller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile",
					className: "block rounded-xl border border-border/60 bg-card p-4 card-hover",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: asset.seller.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: asset.seller.username[0]?.toUpperCase() })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Creator"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-semibold text-sm",
							children: ["@", asset.seller.username]
						})] })]
					})
				})]
			})]
		})
	});
}
//#endregion
export { AssetDetail as component };
