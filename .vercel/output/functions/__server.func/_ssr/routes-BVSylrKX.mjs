import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, w as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { a as Pause, c as Maximize2, i as Play, l as Eye, n as Spline, o as Orbit, r as RotateCcw, s as Minimize2, u as EyeOff } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BVSylrKX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var visualPeriod = (realYears) => Math.pow(realYears, .48);
var BODIES = [
	{
		id: "sun",
		name: "Sol",
		kind: "star",
		radius: 4.6,
		distance: 0,
		eccentricity: 0,
		inclination: 0,
		tilt: 7.25,
		periodYears: 1,
		spinDays: 25,
		phase: 0,
		color: "#f3c15b",
		trail: "#f3c15b",
		real: {
			type: "Estrella de secuencia principal",
			distance: "—",
			period: "25 días (ecuador)",
			diameter: "1,392,700 km",
			gravity: "274 m/s²",
			moons: "8 planetas",
			fact: "Contiene el 99.8% de la masa del sistema solar. En su núcleo, el hidrógeno se fusiona en helio a 15 millones de °C."
		}
	},
	{
		id: "mercury",
		name: "Mercurio",
		kind: "rocky",
		radius: .36,
		distance: 11.2,
		eccentricity: .206,
		inclination: .122,
		tilt: .03,
		periodYears: visualPeriod(.241),
		spinDays: 58.6,
		phase: .4,
		color: "#9a938c",
		trail: "#b8b0a6",
		real: {
			type: "Planeta rocoso",
			distance: "0.39 UA · 58 millones de km",
			period: "88 días terrestres",
			diameter: "4,879 km",
			gravity: "3.7 m/s²",
			moons: "Ninguna",
			fact: "El más cercano al Sol y el más cráterizado. Un día mercuriano dura más que su año: 59 días contra 88."
		}
	},
	{
		id: "venus",
		name: "Venus",
		kind: "rocky",
		radius: .68,
		distance: 15.4,
		eccentricity: .007,
		inclination: .059,
		tilt: 177.4,
		periodYears: visualPeriod(.615),
		spinDays: -243,
		phase: 1.9,
		color: "#e6d3a3",
		trail: "#edd9a8",
		atmosphere: "#efe0b8",
		real: {
			type: "Planeta rocoso",
			distance: "0.72 UA · 108 millones de km",
			period: "225 días terrestres",
			diameter: "12,104 km",
			gravity: "8.9 m/s²",
			moons: "Ninguna",
			fact: "Gira al revés. Su atmósfera de CO₂ produce un efecto invernadero extremo: 464 °C en la superficie, más que Mercurio."
		}
	},
	{
		id: "earth",
		name: "Tierra",
		kind: "rocky",
		radius: .72,
		distance: 20.2,
		eccentricity: .017,
		inclination: 0,
		tilt: 23.44,
		periodYears: 1,
		spinDays: 1,
		phase: 2.7,
		color: "#3d7cc9",
		trail: "#7eb6e8",
		atmosphere: "#6ea8e6",
		moons: [{
			id: "moon",
			name: "Luna",
			radius: .2,
			distance: 1.7,
			periodYears: .09,
			phase: .6,
			color: "#c9c6bf",
			selectable: true
		}],
		real: {
			type: "Planeta rocoso",
			distance: "1 UA · 150 millones de km",
			period: "365.25 días",
			diameter: "12,742 km",
			gravity: "9.8 m/s²",
			moons: "1",
			fact: "El único mundo conocido con vida. El 71% de su superficie es agua líquida, sostenida por una distancia justa al Sol."
		}
	},
	{
		id: "mars",
		name: "Marte",
		kind: "rocky",
		radius: .46,
		distance: 25.6,
		eccentricity: .093,
		inclination: .032,
		tilt: 25.19,
		periodYears: visualPeriod(1.881),
		spinDays: 1.03,
		phase: 4.1,
		color: "#c45c32",
		trail: "#e07a4c",
		atmosphere: "#d9896a",
		real: {
			type: "Planeta rocoso",
			distance: "1.52 UA · 228 millones de km",
			period: "687 días terrestres",
			diameter: "6,779 km",
			gravity: "3.7 m/s²",
			moons: "2 · Fobos y Deimos",
			fact: "El planeta rojo debe su color al óxido de hierro. Alberga Olympus Mons, el volcán más alto del sistema solar."
		}
	},
	{
		id: "jupiter",
		name: "Júpiter",
		kind: "gas",
		radius: 2.05,
		distance: 38.4,
		eccentricity: .049,
		inclination: .023,
		tilt: 3.13,
		periodYears: visualPeriod(11.86),
		spinDays: .41,
		phase: .8,
		color: "#d9b48a",
		trail: "#e0c19a",
		atmosphere: "#e8d2ae",
		moons: [
			{
				id: "io",
				name: "Ío",
				radius: .09,
				distance: 2.55,
				periodYears: .018,
				phase: .2,
				color: "#e8c36a"
			},
			{
				id: "europa",
				name: "Europa",
				radius: .08,
				distance: 3.15,
				periodYears: .032,
				phase: 1.4,
				color: "#d9d4c8"
			},
			{
				id: "ganymede",
				name: "Ganimedes",
				radius: .11,
				distance: 3.85,
				periodYears: .055,
				phase: 2.6,
				color: "#a89b88"
			},
			{
				id: "callisto",
				name: "Calisto",
				radius: .1,
				distance: 4.65,
				periodYears: .09,
				phase: 3.5,
				color: "#7a7368"
			}
		],
		real: {
			type: "Gigante gaseoso",
			distance: "5.2 UA · 778 millones de km",
			period: "11.86 años",
			diameter: "139,820 km",
			gravity: "24.8 m/s²",
			moons: "95+",
			fact: "El más masivo de los planetas. Su Gran Mancha Roja es una tormenta mayor que la Tierra, activa desde al menos 1830."
		}
	},
	{
		id: "saturn",
		name: "Saturno",
		kind: "gas",
		radius: 1.72,
		distance: 49.2,
		eccentricity: .057,
		inclination: .043,
		tilt: 26.73,
		periodYears: visualPeriod(29.45),
		spinDays: .45,
		phase: 5.2,
		color: "#e6d3a1",
		trail: "#f0e0b4",
		atmosphere: "#efe3c0",
		real: {
			type: "Gigante gaseoso",
			distance: "9.58 UA · 1,430 millones de km",
			period: "29.45 años",
			diameter: "116,460 km",
			gravity: "10.4 m/s²",
			moons: "146+",
			fact: "Sus anillos se extienden cientos de miles de kilómetros y tienen apenas decenas de metros de espesor. Flotaría en agua."
		}
	},
	{
		id: "uranus",
		name: "Urano",
		kind: "ice",
		radius: 1.08,
		distance: 59.4,
		eccentricity: .046,
		inclination: .013,
		tilt: 97.77,
		periodYears: visualPeriod(84),
		spinDays: -.72,
		phase: 1.3,
		color: "#7ec8d4",
		trail: "#9ad7e0",
		atmosphere: "#a6dbe3",
		real: {
			type: "Gigante de hielo",
			distance: "19.2 UA · 2,870 millones de km",
			period: "84 años",
			diameter: "50,724 km",
			gravity: "8.7 m/s²",
			moons: "28",
			fact: "Rueda de lado: su eje está inclinado 98°. Cada polo pasa 42 años en luz continua y 42 en oscuridad."
		}
	},
	{
		id: "neptune",
		name: "Neptuno",
		kind: "ice",
		radius: 1.04,
		distance: 69.2,
		eccentricity: .01,
		inclination: .031,
		tilt: 28.32,
		periodYears: visualPeriod(164.8),
		spinDays: .67,
		phase: 3.8,
		color: "#3b6fd6",
		trail: "#6b93e3",
		atmosphere: "#5b86dc",
		real: {
			type: "Gigante de hielo",
			distance: "30.1 UA · 4,500 millones de km",
			period: "164.8 años",
			diameter: "49,244 km",
			gravity: "11.2 m/s²",
			moons: "16",
			fact: "El más lejano y el más ventoso. Sus vientos superan los 2,000 km/h, los más rápidos del sistema solar."
		}
	}
];
var MOON_INFO = {
	id: "moon",
	name: "Luna",
	color: "#c9c6bf",
	real: {
		type: "Satélite natural",
		distance: "384,400 km de la Tierra",
		period: "27.3 días",
		diameter: "3,475 km",
		gravity: "1.6 m/s²",
		moons: "—",
		fact: "Siempre muestra la misma cara a la Tierra. Sus mareas frenan nuestro día y estabilizan el eje terrestre."
	}
};
var FOCUSABLE = [
	"sun",
	"mercury",
	"venus",
	"earth",
	"mars",
	"jupiter",
	"saturn",
	"uranus",
	"neptune"
];
var bodyById = Object.fromEntries(BODIES.map((b) => [b.id, b]));
function focusDistance(id) {
	if (!id) return 58;
	if (id === "moon") return 3.4;
	const body = bodyById[id];
	if (!body) return 58;
	if (body.id === "sun") return 16;
	if (body.kind === "gas") return body.radius * 5.4;
	if (body.kind === "ice") return body.radius * 6.2;
	return Math.max(4.2, body.radius * 7.5);
}
function orbitPoint(distance, eccentricity, theta) {
	const r = distance * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(theta));
	return {
		x: Math.cos(theta) * r,
		z: Math.sin(theta) * r,
		r
	};
}
/** Shared simulation clock. Mutated in the R3F frame loop, never per-frame React state. */
var clock = { years: 0 };
var createSim = () => create((set) => ({
	paused: false,
	speed: 1,
	selected: null,
	showLabels: true,
	showOrbits: true,
	showTrails: true,
	years: 0,
	togglePause: () => set((s) => ({ paused: !s.paused })),
	setPaused: (paused) => set({ paused }),
	setSpeed: (speed) => set({ speed }),
	select: (id) => set({ selected: id }),
	toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
	toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),
	toggleTrails: () => set((s) => ({ showTrails: !s.showTrails }))
}));
var globalRef = globalThis;
var useSim = globalRef.__orbitaSim ?? (globalRef.__orbitaSim = createSim());
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var SPEED_MIN = -2;
var SPEED_MAX = 5;
function speedFromSlider(t) {
	return Math.pow(2, t);
}
function sliderFromSpeed(speed) {
	return Math.log2(speed);
}
function formatSpeed(speed) {
	if (speed < 1) return `${speed.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}×`;
	if (speed < 10) return `${speed % 1 === 0 ? speed.toFixed(0) : speed.toFixed(1)}×`;
	return `${Math.round(speed)}×`;
}
function InfoPanel() {
	const selected = useSim((s) => s.selected);
	const select = useSim((s) => s.select);
	const data = (0, import_react.useMemo)(() => {
		if (!selected) return null;
		if (selected === "moon") return {
			name: MOON_INFO.name,
			color: MOON_INFO.color,
			real: MOON_INFO.real
		};
		const body = bodyById[selected];
		if (!body) return null;
		return {
			name: body.name,
			color: body.color,
			real: body.real
		};
	}, [selected]);
	if (!data) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: cn("pointer-events-auto w-full rounded-xl bg-surface/95 p-4 shadow-border", "max-h-[42vh] overflow-y-auto md:max-h-[min(70vh,36rem)] md:w-80"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-widest text-subtle",
							children: "Foco"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold tracking-tight text-fg text-balance",
							children: data.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 size-2.5 shrink-0 rounded-full",
						style: { backgroundColor: data.color },
						"aria-hidden": true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: data.real.type
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-border pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Distancia",
							value: data.real.distance
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Periodo",
							value: data.real.period
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Diámetro",
							value: data.real.diameter
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Gravedad",
							value: data.real.gravity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Satélites",
							value: data.real.moons
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-pretty text-sm leading-snug text-muted",
					children: data.real.fact
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => select(null),
					className: "h-11 rounded-md bg-raised px-3 text-sm font-medium text-fg shadow-border transition-colors duration-[var(--motion-quick)] hover:bg-raised/80",
					children: "Vista general"
				})
			]
		})
	});
}
function InfoRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "font-mono text-xs uppercase tracking-wider text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "truncate text-sm text-fg",
			children: value
		})]
	});
}
function Toggle({ pressed, onPressed, label, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": pressed,
		"aria-label": label,
		title: label,
		onClick: onPressed,
		className: cn("inline-flex h-11 min-w-11 items-center justify-center rounded-md px-2.5 text-sm font-medium shadow-border transition-colors duration-[var(--motion-quick)]", pressed ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-4",
			strokeWidth: 1.75
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-2 hidden lg:inline",
			children: label
		})]
	});
}
function Hud() {
	const paused = useSim((s) => s.paused);
	const speed = useSim((s) => s.speed);
	const years = useSim((s) => s.years);
	const selected = useSim((s) => s.selected);
	const showLabels = useSim((s) => s.showLabels);
	const showOrbits = useSim((s) => s.showOrbits);
	const showTrails = useSim((s) => s.showTrails);
	const [full, setFull] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.code === "Space") {
				e.preventDefault();
				useSim.getState().togglePause();
			} else if (e.code === "Escape") useSim.getState().select(null);
			else if (e.key === "+" || e.key === "=") {
				const next = Math.min(SPEED_MAX, sliderFromSpeed(useSim.getState().speed) + .5);
				useSim.getState().setSpeed(speedFromSlider(next));
			} else if (e.key === "-" || e.key === "_") {
				const next = Math.max(SPEED_MIN, sliderFromSpeed(useSim.getState().speed) - .5);
				useSim.getState().setSpeed(speedFromSlider(next));
			}
		};
		const onFs = () => setFull(Boolean(document.fullscreenElement));
		window.addEventListener("keydown", onKey);
		document.addEventListener("fullscreenchange", onFs);
		return () => {
			window.removeEventListener("keydown", onKey);
			document.removeEventListener("fullscreenchange", onFs);
		};
	}, []);
	const slider = sliderFromSpeed(speed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "absolute left-3 top-3 z-20 sm:left-5 sm:top-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto rounded-lg bg-surface/90 px-4 py-3 shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-semibold tracking-tight text-fg",
						children: "Órbita"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs tabular-nums text-subtle",
						children: [
							"Año ",
							years.toFixed(2),
							paused ? " · en pausa" : ""
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "pointer-events-auto absolute right-3 top-3 hidden h-11 w-11 items-center justify-center rounded-md bg-surface/90 text-muted shadow-border sm:right-5 sm:top-5 sm:inline-flex",
				"aria-label": full ? "Salir de pantalla completa" : "Pantalla completa",
				onClick: () => {
					if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => void 0);
					else document.exitFullscreen().catch(() => void 0);
				},
				children: full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-3 right-3 top-24 z-20 max-md:bottom-36 max-md:top-auto md:left-5 md:right-auto md:top-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoPanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-3 bottom-3 z-20 flex flex-col items-stretch gap-2 sm:inset-x-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "planet-nav pointer-events-auto overflow-x-auto",
						"aria-label": "Planetas",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex w-max min-w-full flex-nowrap justify-center gap-1.5",
							children: FOCUSABLE.map((id) => {
								const body = BODIES.find((b) => b.id === id);
								const active = selected === id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => useSim.getState().select(active ? null : id),
									className: cn("inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium shadow-border transition-colors duration-[var(--motion-quick)] sm:h-11 sm:px-3 sm:text-sm", active ? "bg-accent text-accent-fg" : "bg-surface/90 text-muted hover:text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-2 rounded-full",
										style: { backgroundColor: body.color },
										"aria-hidden": true
									}), body.name]
								}, id);
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto flex w-full flex-col gap-2 rounded-lg bg-surface/90 p-2.5 shadow-border sm:flex-row sm:items-center sm:gap-3 sm:px-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => useSim.getState().togglePause(),
									className: "inline-flex h-11 min-w-11 items-center justify-center rounded-md bg-accent px-3 text-accent-fg",
									"aria-label": paused ? "Reanudar" : "Pausar",
									children: [paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
										className: "size-4 ml-0.5",
										strokeWidth: 1.75
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
										className: "size-4",
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 hidden sm:inline",
										children: paused ? "Reanudar" : "Pausar"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										clock.years = 0;
										useSim.setState({
											years: 0,
											selected: null
										});
									},
									className: "inline-flex h-11 w-11 items-center justify-center rounded-md bg-raised text-muted shadow-border hover:text-fg",
									"aria-label": "Reiniciar tiempo",
									title: "Reiniciar tiempo",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
										className: "size-4",
										strokeWidth: 1.75
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-0 flex-1 flex-col gap-1 sm:px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center justify-between font-mono text-xs uppercase tracking-wider text-subtle",
									children: ["Velocidad", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums text-fg",
										children: formatSpeed(speed)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: SPEED_MIN,
									max: SPEED_MAX,
									step: .05,
									value: slider,
									onChange: (e) => useSim.getState().setSpeed(speedFromSlider(Number(e.target.value))),
									className: "solar-slider",
									"aria-label": "Velocidad de simulación"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										pressed: showOrbits,
										onPressed: () => useSim.getState().toggleOrbits(),
										label: "Órbitas",
										icon: Orbit
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										pressed: showTrails,
										onPressed: () => useSim.getState().toggleTrails(),
										label: "Estelas",
										icon: Spline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										pressed: showLabels,
										onPressed: () => useSim.getState().toggleLabels(),
										label: "Nombres",
										icon: showLabels ? Eye : EyeOff
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hidden px-1 text-center font-mono text-xs text-subtle md:block",
						children: "Espacio pausa · Esc vista general · +/− velocidad"
					})
				]
			})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
var SolarCanvas = (0, import_react.lazy)(() => import("./solar-canvas-DVw3ssqk.mjs").then((m) => ({ default: m.SolarCanvas })));
function Home() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: "Órbita — explorador del sistema solar"
			}),
			mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingMark, {}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolarCanvas, {})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingMark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "solar-vignette pointer-events-none absolute inset-0 z-[1]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {})
		]
	});
}
function LoadingMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh items-center justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl tracking-tight text-fg",
			children: "Cargando el sistema solar"
		})
	});
}
//#endregion
export { focusDistance as a, BODIES as i, useSim as n, orbitPoint as o, clock as r, routes_exports as t };
