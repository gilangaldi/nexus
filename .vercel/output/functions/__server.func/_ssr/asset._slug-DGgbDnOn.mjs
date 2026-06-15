import { n as assetBySlugQuery } from "./queries-BnrFKWYr.mjs";
import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset._slug-DGgbDnOn.js
var $$splitComponentImporter = () => import("./asset._slug-DLi_7kFX.mjs");
var $$splitNotFoundComponentImporter = () => import("./asset._slug-Dks12OxH.mjs");
var $$splitErrorComponentImporter = () => import("./asset._slug-BGbIsMbw.mjs");
var Route = createFileRoute("/asset/$slug")({
	loader: async ({ context, params }) => {
		if (!await context.queryClient.ensureQueryData(assetBySlugQuery(params.slug))) throw notFound();
	},
	head: ({ params }) => ({ meta: [{ title: `${params.slug} — NEXUS` }, {
		name: "description",
		content: "Premium game asset on NEXUS marketplace."
	}] }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
