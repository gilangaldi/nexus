import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset._slug-BGbIsMbw.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "container mx-auto px-4 py-20 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-xl font-semibold",
		children: "Couldn't load asset"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground mt-2",
		children: error.message
	})]
});
//#endregion
export { SplitErrorComponent as errorComponent };
