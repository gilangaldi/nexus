import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-mNz7SclJ.js
/** Patch missing crypto.randomUUID (older browsers / non-secure contexts). */
function makeUuid() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0;
		return (c === "x" ? r : r & 3 | 8).toString(16);
	});
}
if (typeof globalThis !== "undefined") {
	const g = globalThis;
	if (!g.crypto) g.crypto = {};
	if (typeof g.crypto.randomUUID !== "function") g.crypto.randomUUID = makeUuid;
}
function randomId() {
	if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
	return makeUuid();
}
var DEFAULT_SUPABASE_URL = "https://htssjorrdxdliouzmayd.supabase.co";
var DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0c3Nqb3JyZHhkbGlvdXptYXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjM1NTksImV4cCI6MjA5NjgzOTU1OX0._Q42PniU3DmI7FSUZZhVA-uEd8IVhP2AZkRfif9shcA";
function createSupabaseClient() {
	return createClient(process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_ANON_KEY, { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as n, randomId as t };
