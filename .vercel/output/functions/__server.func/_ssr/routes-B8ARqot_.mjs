import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PJ5WWh09.mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as featuredAssetsQuery, i as categoriesQuery, o as marketplaceStatsQuery } from "./queries-BnrFKWYr.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ArrowRight, d as Shield, i as Users, m as Package, s as TrendingUp, t as Zap, u as Sparkles, w as Coins } from "../_libs/lucide-react.mjs";
import { t as AssetCard } from "./asset-card-HSAprI66.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B8ARqot_.js
var import_jsx_runtime = require_jsx_runtime();
var hero_default = "/assets/hero-CPrdLixs.jpg";
function Home() {
	const { data: categories } = useSuspenseQuery(categoriesQuery);
	const { data: featured } = useSuspenseQuery(featuredAssetsQuery);
	const { data: stats } = useSuspenseQuery(marketplaceStatsQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border/60",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 grid-bg opacity-40",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0",
					style: { background: "var(--gradient-glow)" },
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32 relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-3xl mx-auto text-center space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground glass",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Powered by Solana · Devnet"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-5xl md:text-7xl font-bold tracking-tight",
								children: [
									"The next generation ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "gradient-text",
										children: "game asset marketplace"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-muted-foreground max-w-xl mx-auto",
								children: "Buy and sell premium game assets on Solana. From characters and environments to scripts and SFX — all paid instantly in SOL."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-center gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "hero",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/marketplace",
										children: ["Explore Assets ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "outline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/sell",
										children: "Start Selling"
									})
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-16 max-w-5xl mx-auto rounded-2xl border border-border/60 overflow-hidden glass",
						style: { boxShadow: "var(--shadow-soft)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hero_default,
							alt: "NEXUS marketplace preview",
							width: 1920,
							height: 1080,
							className: "w-full"
						})
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container mx-auto px-4 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-5" }),
						label: "Total Assets",
						value: stats.assets.toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }),
						label: "Creators",
						value: stats.creators.toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-5" }),
						label: "Transactions",
						value: stats.transactions.toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-5" }),
						label: "Volume",
						value: `${stats.volume.toFixed(2)} SOL`
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container mx-auto px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Browse by category",
				subtitle: "Find exactly what your game needs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-8",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/marketplace",
					search: { category: c.slug },
					className: "group rounded-xl border border-border/60 bg-card p-5 card-hover",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-10 rounded-lg grid place-items-center mb-3 bg-secondary/60 text-primary group-hover:scale-110 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-sm",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-1 line-clamp-1",
							children: c.description
						})
					]
				}, c.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container mx-auto px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Featured assets",
				subtitle: "Curated by the NEXUS team",
				cta: {
					to: "/marketplace",
					label: "View all"
				}
			}), featured.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8",
				children: featured.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetCard, { asset: a }, a.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container mx-auto px-4 py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-3 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Value, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {}),
						title: "Instant SOL payments",
						body: "Transactions settle in under a second. No middlemen, no chargebacks."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Value, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {}),
						title: "Verified ownership",
						body: "On-chain proof of purchase. Re-download anytime from your library."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Value, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}),
						title: "Built for creators",
						body: "Keep 95% of every sale. Upload, price in SOL, get paid directly."
					})
				]
			})
		})
	] });
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/60 bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-muted-foreground text-xs",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 text-2xl font-display font-bold",
			children: value
		})]
	});
}
function SectionHeader({ title, subtitle, cta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl md:text-3xl font-bold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: subtitle
		})] }), cta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: cta.to,
			className: "text-sm text-primary hover:underline shrink-0",
			children: [cta.label, " →"]
		})]
	});
}
function Value({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/60 bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "size-10 rounded-lg grid place-items-center bg-secondary/60 text-primary mb-4",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: body
			})
		]
	});
}
function EmptyState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 rounded-xl border border-dashed border-border/60 p-12 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "No featured assets yet — be the first creator to publish."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			variant: "gradient",
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/sell",
				children: "Start Selling"
			})
		})]
	});
}
//#endregion
export { Home as component };
