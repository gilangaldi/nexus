import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PJ5WWh09.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset._slug-Dks12OxH.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "container mx-auto px-4 py-20 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-2xl font-bold",
		children: "Asset not found"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		className: "mt-4",
		variant: "outline",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/marketplace",
			children: "Back to marketplace"
		})
	})]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
