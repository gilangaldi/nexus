import { o as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-mNz7SclJ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-PJ5WWh09.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useAuth } from "./use-auth-Mz2IfLl9.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Download, p as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DjPV9x--.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-DwXn1K80.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Library() {
	const { user } = useAuth();
	const [q, setQ] = (0, import_react.useState)("");
	const { data: items = [], isLoading } = useQuery({
		queryKey: ["library", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("asset_ownership").select("created_at, asset:assets(id, slug, title, thumbnail_url, price_sol, preview_urls)").eq("user_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const filtered = items.filter((i) => !q || i.asset?.title.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mx-auto px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-4 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "My Library"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "All your purchased assets, ready to download."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-72",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search library…",
					className: "pl-9 h-10"
				})]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "Loading…"
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-dashed border-border/60 p-16 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "No assets yet. Discover something on the marketplace."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-4",
				variant: "gradient",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/marketplace",
					children: "Browse marketplace"
				})
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
			children: filtered.map((it, i) => it.asset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/60 bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/asset/$slug",
					params: { slug: it.asset.slug },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: it.asset.thumbnail_url,
						alt: it.asset.title,
						className: "aspect-[4/3] w-full object-cover",
						loading: "lazy"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-sm",
						children: it.asset.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "mt-3 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: it.asset.preview_urls?.[0] ?? "#",
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download"]
						})
					})]
				})]
			}, i))
		})]
	});
}
//#endregion
export { Library as component };
