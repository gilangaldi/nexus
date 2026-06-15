import { o as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, l as Trigger2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase, t as randomId } from "./client-mNz7SclJ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as buttonVariants, r as cn, t as Button } from "./button-PJ5WWh09.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useAuth } from "./use-auth-Mz2IfLl9.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Trash2, o as Upload, v as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-DjPV9x--.mjs";
import { t as Label } from "./label-CEIUvAE7.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C2FCzRnN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sell-DgJOku9h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function slugify(s) {
	return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) + "-" + Math.random().toString(36).slice(2, 7);
}
function extractStoragePath(url) {
	const idx = url.indexOf("/storage/v1/object/public/nexus-assets/");
	if (idx === -1) return null;
	return decodeURIComponent(url.slice(idx + 39));
}
function Sell() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		category_id: "",
		price_sol: "0.5",
		tags: ""
	});
	const [thumb, setThumb] = (0, import_react.useState)(null);
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => (await supabase.from("categories").select("id, name").order("sort_order")).data ?? []
	});
	const { data: myAssets = [], refetch } = useQuery({
		queryKey: ["my-assets", user?.id],
		enabled: !!user,
		queryFn: async () => (await supabase.from("assets").select("id, title, price_sol, status, downloads_count, thumbnail_url, slug").eq("seller_id", user.id).order("created_at", { ascending: false })).data ?? []
	});
	const { data: stats } = useQuery({
		queryKey: ["seller-stats", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data: txs } = await supabase.from("transactions").select("amount_sol").eq("seller_id", user.id).eq("status", "confirmed");
			return {
				sales: txs?.length ?? 0,
				revenue: (txs ?? []).reduce((s, t) => s + Number(t.amount_sol || 0), 0)
			};
		}
	});
	async function submit(e) {
		e.preventDefault();
		if (!thumb) {
			toast.error("Add a thumbnail image");
			return;
		}
		setBusy(true);
		try {
			const ext = thumb.name.split(".").pop() ?? "jpg";
			const path = `${user.id}/${randomId()}.${ext}`;
			const { data: up, error: upErr } = await supabase.storage.from("nexus-assets").upload(path, thumb, {
				cacheControl: "3600",
				upsert: false
			});
			if (upErr) throw new Error(`Gagal upload gambar: ${upErr.message}. Pastikan bucket "nexus-assets" sudah dibuat di Supabase.`);
			const thumbUrl = supabase.storage.from("nexus-assets").getPublicUrl(up.path).data.publicUrl;
			const slug = slugify(form.title);
			const { error } = await supabase.from("assets").insert({
				seller_id: user.id,
				category_id: form.category_id || null,
				title: form.title,
				slug,
				description: form.description,
				thumbnail_url: thumbUrl,
				preview_urls: [],
				price_sol: Number(form.price_sol),
				tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
				status: "approved"
			});
			if (error) throw error;
			await supabase.from("user_roles").upsert({
				user_id: user.id,
				role: "seller"
			}, { onConflict: "user_id,role" });
			toast.success("Asset published");
			setForm({
				title: "",
				description: "",
				category_id: "",
				price_sol: "0.5",
				tags: ""
			});
			setThumb(null);
			refetch();
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			navigate({
				to: "/asset/$slug",
				params: { slug }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to publish");
		} finally {
			setBusy(false);
		}
	}
	async function handleDelete(asset) {
		setDeletingId(asset.id);
		try {
			const storagePath = extractStoragePath(asset.thumbnail_url);
			if (storagePath) await supabase.storage.from("nexus-assets").remove([storagePath]);
			const { error } = await supabase.from("assets").delete().eq("id", asset.id);
			if (error) throw error;
			toast.success(`"${asset.title}" berhasil dihapus`);
			refetch();
			queryClient.invalidateQueries({ queryKey: ["assets"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal menghapus asset");
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mx-auto px-4 py-10 space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Seller Dashboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Upload assets and track your sales."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBox, {
						label: "Assets",
						value: String(myAssets.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBox, {
						label: "Sales",
						value: String(stats?.sales ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBox, {
						label: "Revenue",
						value: `${(stats?.revenue ?? 0).toFixed(2)} SOL`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBox, {
						label: "Downloads",
						value: String(myAssets.reduce((s, a) => s + a.downloads_count, 0))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "rounded-xl border border-border/60 bg-card p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Upload new asset"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.title,
								onChange: (e) => setForm({
									...form,
									title: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								required: true,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								}),
								rows: 4
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.category_id,
									onValueChange: (v) => setForm({
										...form,
										category_id: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.id,
										children: c.name
									}, c.id)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price (SOL)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									min: "0",
									required: true,
									value: form.price_sol,
									onChange: (e) => setForm({
										...form,
										price_sol: e.target.value
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tags (comma separated)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.tags,
								onChange: (e) => setForm({
									...form,
									tags: e.target.value
								}),
								placeholder: "lowpoly, fantasy, rigged"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Thumbnail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "file",
								accept: "image/*",
								onChange: (e) => setThumb(e.target.files?.[0] ?? null)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							variant: "gradient",
							disabled: busy,
							className: "w-full",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Publish asset"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/60 bg-card p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold mb-4",
						children: "Your assets"
					}), myAssets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No assets yet — publish your first one."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border/60",
						children: myAssets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-3 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: a.thumbnail_url,
									alt: "",
									className: "size-12 rounded-md object-cover border border-border/60"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/asset/$slug",
										params: { slug: a.slug },
										className: "font-medium text-sm hover:underline",
										children: a.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											a.status,
											" · ",
											a.downloads_count,
											" downloads"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-sm",
									children: [a.price_sol, " SOL"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "text-destructive hover:text-destructive shrink-0",
										disabled: deletingId === a.id,
										children: [deletingId === a.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Hapus"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus asset?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
									"Asset \"",
									a.title,
									"\" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
								] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
									className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
									onClick: () => handleDelete(a),
									children: "Hapus"
								})] })] })] })
							]
						}, a.id))
					})]
				})]
			})
		]
	});
}
function StatBox({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/60 bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-2xl font-display font-bold",
			children: value
		})]
	});
}
//#endregion
export { Sell as component };
