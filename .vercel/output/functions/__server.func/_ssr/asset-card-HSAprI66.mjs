import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Badge } from "./queries-BnrFKWYr.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Download, l as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset-card-HSAprI66.js
var import_jsx_runtime = require_jsx_runtime();
function AssetCard({ asset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/asset/$slug",
		params: { slug: asset.slug },
		className: "group block rounded-xl border border-border/60 bg-card overflow-hidden card-hover",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "aspect-[4/3] overflow-hidden bg-muted relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: asset.thumbnail_url,
				alt: asset.title,
				loading: "lazy",
				className: "size-full object-cover transition-transform duration-300 group-hover:scale-105"
			}), asset.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "absolute top-2 left-2 glass border-0 text-xs",
				children: asset.category.name
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-sm leading-tight line-clamp-1",
					children: asset.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate",
						children: ["@", asset.seller?.username ?? "unknown"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }), asset.rating_avg.toFixed(1)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), asset.downloads_count]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between pt-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-sm font-semibold gradient-text",
						children: [asset.price_sol, " SOL"]
					})
				})
			]
		})]
	});
}
//#endregion
export { AssetCard as t };
