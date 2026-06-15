import { i as categoriesQuery, r as assetsQuery } from "./queries-Bi98Ji3l.mjs";
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketplace-BrwP6qs6.js
var $$splitComponentImporter = () => import("./marketplace-C0DPWbZN.mjs");
var searchSchema = objectType({
	category: stringType().optional(),
	search: stringType().optional(),
	sort: enumType([
		"newest",
		"popular",
		"rating"
	]).optional()
});
var Route = createFileRoute("/marketplace")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await Promise.all([context.queryClient.ensureQueryData(categoriesQuery), context.queryClient.ensureQueryData(assetsQuery(deps))]);
	},
	head: () => ({ meta: [{ title: "Marketplace — NEXUS" }, {
		name: "description",
		content: "Browse premium game assets on NEXUS. Filter by category, price, and popularity."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
