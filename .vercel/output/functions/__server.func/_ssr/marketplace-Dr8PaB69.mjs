import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PJ5WWh09.mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { i as categoriesQuery, r as assetsQuery, t as Badge } from "./queries-BnrFKWYr.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DjPV9x--.mjs";
import { t as Route } from "./marketplace-CqmhkCPY.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C2FCzRnN.mjs";
import { t as AssetCard } from "./asset-card-HSAprI66.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketplace-Dr8PaB69.js
var import_jsx_runtime = require_jsx_runtime();
function Marketplace() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: categories } = useSuspenseQuery(categoriesQuery);
	const { data: assets } = useSuspenseQuery(assetsQuery(search));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mx-auto px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl md:text-4xl font-bold tracking-tight",
					children: "Marketplace"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Discover premium assets from creators worldwide."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 w-full md:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 md:w-72",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search assets…",
							className: "pl-9 h-10",
							defaultValue: search.search ?? "",
							onKeyDown: (e) => {
								if (e.key === "Enter") {
									const v = e.target.value;
									navigate({ search: {
										...search,
										search: v || void 0
									} });
								}
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: search.sort ?? "newest",
						onValueChange: (v) => navigate({ search: {
							...search,
							sort: v
						} }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36 h-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "newest",
								children: "Newest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "popular",
								children: "Most popular"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "rating",
								children: "Top rated"
							})
						] })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/marketplace",
					search: {},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: !search.category ? "default" : "outline",
						className: "cursor-pointer",
						children: "All"
					})
				}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/marketplace",
					search: {
						...search,
						category: c.slug
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: search.category === c.slug ? "default" : "outline",
						className: "cursor-pointer",
						children: c.name
					})
				}, c.id))]
			}),
			assets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed border-border/60 p-16 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "No assets match your filters yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-4",
					variant: "gradient",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/sell",
						children: "Be the first to publish"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
				children: assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetCard, { asset: a }, a.id))
			})
		]
	});
}
//#endregion
export { Marketplace as component };
