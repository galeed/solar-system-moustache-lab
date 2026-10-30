import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, _ as Object3D, a as Canvas, b as Vector3, c as BufferGeometry, d as Color, f as Float32BufferAttribute, g as Mesh, h as MathUtils, l as CanvasTexture, m as LineBasicMaterial, n as Line$1, o as useFrame, p as Line, r as Html, s as BufferAttribute, t as CameraControls, u as ClampToEdgeWrapping, v as RepeatWrapping, w as require_react, y as SRGBColorSpace } from "../_libs/@react-three/drei+[...].mjs";
import { a as focusDistance, i as BODIES, n as useSim, o as orbitPoint, r as clock } from "./routes-BVSylrKX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solar-canvas-DVw3ssqk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var bodyRegistry = /* @__PURE__ */ new Map();
function registerBody(id, obj) {
	if (obj) bodyRegistry.set(id, obj);
	else bodyRegistry.delete(id);
}
function hash2(x, y, seed) {
	const n = Math.sin(x * 127.1 + y * 311.7 + seed * 19.19) * 43758.5453;
	return n - Math.floor(n);
}
function valueNoise(x, y, seed) {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const xf = x - xi;
	const yf = y - yi;
	const u = xf * xf * (3 - 2 * xf);
	const v = yf * yf * (3 - 2 * yf);
	const a = hash2(xi, yi, seed);
	const b = hash2(xi + 1, yi, seed);
	const c = hash2(xi, yi + 1, seed);
	const d = hash2(xi + 1, yi + 1, seed);
	return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}
function fbm(x, y, seed, octaves = 5) {
	let v = 0;
	let a = .5;
	let f = 1;
	for (let i = 0; i < octaves; i++) {
		v += a * valueNoise(x * f, y * f, seed + i * 13);
		a *= .5;
		f *= 2;
	}
	return v;
}
function canvas(w, h) {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	return {
		c,
		ctx: c.getContext("2d", { willReadFrequently: true }),
		w,
		h
	};
}
function toTexture(c) {
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	tex.anisotropy = 8;
	tex.wrapS = RepeatWrapping;
	tex.wrapT = ClampToEdgeWrapping;
	tex.needsUpdate = true;
	return tex;
}
function mix(a, b, t) {
	return a + (b - a) * t;
}
function rgb(r, g, b) {
	return [
		r,
		g,
		b
	];
}
function lerpColor(a, b, t) {
	return rgb(mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t));
}
function put(data, i, col, a = 255) {
	data[i] = col[0];
	data[i + 1] = col[1];
	data[i + 2] = col[2];
	data[i + 3] = a;
}
function paintPixels(ctx, w, h, fn) {
	const img = ctx.getImageData(0, 0, w, h);
	const d = img.data;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const col = fn(x, y, x / w, y / h);
		put(d, (y * w + x) * 4, col);
	}
	ctx.putImageData(img, 0, 0);
}
function makeMercuryTexture() {
	const { c, ctx, w, h } = canvas(512, 256);
	paintPixels(ctx, w, h, (x, y, u, v) => {
		const n = fbm(u * 8, v * 4, 11);
		const crater = Math.pow(Math.max(0, .62 - fbm(u * 14, v * 7, 4)), 3);
		const dark = lerpColor(lerpColor(rgb(78, 74, 70), rgb(168, 160, 150), n), rgb(42, 40, 38), crater * 4);
		const pole = Math.abs(v - .5) * 2;
		return lerpColor(dark, rgb(190, 186, 180), Math.max(0, pole - .88) * 4);
	});
	return toTexture(c);
}
function makeVenusTexture() {
	const { c, ctx, w, h } = canvas(512, 256);
	paintPixels(ctx, w, h, (_x, _y, u, v) => {
		const swirl = fbm(u * 4 + Math.sin(v * 8) * .4, v * 6, 21);
		const band = .5 + .5 * Math.sin(v * 18 + swirl * 4);
		return lerpColor(rgb(196, 164, 96), rgb(236, 220, 176), swirl * .7 + band * .3);
	});
	return toTexture(c);
}
function makeEarthTexture() {
	const { c, ctx, w, h } = canvas(1024, 512);
	paintPixels(ctx, w, h, (_x, _y, u, v) => {
		const n = fbm(u * 7, v * 4, 7);
		const n2 = fbm(u * 18, v * 10, 29);
		const blobs = [
			[
				.18,
				.42,
				.13,
				.28
			],
			[
				.22,
				.62,
				.09,
				.18
			],
			[
				.52,
				.48,
				.11,
				.22
			],
			[
				.58,
				.34,
				.2,
				.16
			],
			[
				.72,
				.38,
				.16,
				.14
			],
			[
				.84,
				.68,
				.07,
				.08
			],
			[
				.08,
				.28,
				.16,
				.08
			]
		];
		let land = 0;
		for (const [cx, cy, rx, ry] of blobs) {
			const dx = (u - cx) / rx;
			const dy = (v - cy) / ry;
			land = Math.max(land, 1 - (dx * dx + dy * dy));
		}
		land = Math.max(0, land * 1.15 - .18 - n * .22);
		const ice = Math.max(0, Math.abs(v - .5) * 2 - .78) * 4;
		const ocean = lerpColor(rgb(12, 42, 92), rgb(28, 92, 148), n * .6);
		const ground = lerpColor(rgb(46, 92, 42), rgb(142, 124, 72), n2);
		let col = land > .15 ? lerpColor(ocean, ground, Math.min(1, land)) : ocean;
		col = lerpColor(col, rgb(236, 242, 248), Math.min(1, ice));
		const cloud = Math.max(0, fbm(u * 10 + 2, v * 5, 90) - .55);
		col = lerpColor(col, rgb(245, 248, 252), cloud * 1.6);
		return col;
	});
	return toTexture(c);
}
function makeMarsTexture() {
	const { c, ctx, w, h } = canvas(512, 256);
	paintPixels(ctx, w, h, (_x, _y, u, v) => {
		const n = fbm(u * 6, v * 4, 3);
		const maria = Math.max(0, fbm(u * 5, v * 3, 17) - .55);
		let col = lerpColor(rgb(140, 62, 36), rgb(196, 102, 58), n);
		col = lerpColor(col, rgb(86, 48, 36), maria * 2);
		const ice = Math.max(0, Math.abs(v - .5) * 2 - .82) * 5;
		col = lerpColor(col, rgb(232, 236, 240), Math.min(1, ice));
		return col;
	});
	return toTexture(c);
}
function makeMoonTexture() {
	const { c, ctx, w, h } = canvas(256, 128);
	paintPixels(ctx, w, h, (_x, _y, u, v) => {
		const n = fbm(u * 8, v * 4, 44);
		const crater = Math.pow(Math.max(0, .58 - fbm(u * 16, v * 8, 8)), 2.4);
		return lerpColor(lerpColor(rgb(92, 90, 86), rgb(188, 184, 176), n), rgb(48, 46, 44), crater * 3);
	});
	return toTexture(c);
}
function makeJupiterTexture() {
	const { c, ctx, w, h } = canvas(1024, 512);
	paintPixels(ctx, w, h, (_x, _y, u, v) => {
		const swirl = fbm(u * 6, v * 18, 5);
		const band = Math.sin((v + swirl * .04) * Math.PI * 14);
		const cream = rgb(232, 210, 170);
		const rust = rgb(176, 108, 62);
		const white = rgb(244, 236, 214);
		let col = lerpColor(cream, rust, .5 + .5 * band);
		col = lerpColor(col, white, Math.max(0, swirl - .55) * 1.4);
		const dx = (u - .72) / .08;
		const dy = (v - .58) / .05;
		const spot = Math.max(0, 1 - (dx * dx + dy * dy));
		col = lerpColor(col, rgb(188, 64, 42), Math.pow(spot, 1.4));
		return col;
	});
	return toTexture(c);
}
function makeSaturnTexture() {
	const { c, ctx, w, h } = canvas(1024, 512);
	paintPixels(ctx, w, h, (_x, _y, u, v) => {
		const swirl = fbm(u * 5, v * 16, 12);
		const band = Math.sin((v + swirl * .03) * Math.PI * 12);
		return lerpColor(rgb(236, 220, 176), rgb(196, 164, 108), .45 + .45 * band);
	});
	return toTexture(c);
}
function makeUranusTexture() {
	const { c, ctx, w, h } = canvas(512, 256);
	paintPixels(ctx, w, h, (_x, _y, u, v) => {
		const n = fbm(u * 3, v * 4, 31);
		return lerpColor(rgb(110, 188, 196), rgb(168, 224, 228), n * .55 + (.5 - Math.abs(v - .5)) * .3);
	});
	return toTexture(c);
}
function makeNeptuneTexture() {
	const { c, ctx, w, h } = canvas(512, 256);
	paintPixels(ctx, w, h, (_x, _y, u, v) => {
		const n = fbm(u * 5, v * 8, 19);
		const band = .5 + .5 * Math.sin(v * 10 + n * 2);
		let col = lerpColor(rgb(28, 62, 156), rgb(72, 130, 214), n * .6 + band * .25);
		const dx = (u - .35) / .07;
		const dy = (v - .42) / .045;
		const spot = Math.max(0, 1 - (dx * dx + dy * dy));
		col = lerpColor(col, rgb(18, 36, 92), spot);
		const streak = Math.max(0, fbm(u * 12, v * 3, 2) - .62);
		col = lerpColor(col, rgb(210, 228, 255), streak * 1.8);
		return col;
	});
	return toTexture(c);
}
function makeRingTexture() {
	const { c, ctx, w, h } = canvas(1024, 64);
	const img = ctx.getImageData(0, 0, w, h);
	const d = img.data;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const u = x / w;
		const cassini = Math.abs(u - .62) < .035 ? 0 : 1;
		const gap2 = Math.abs(u - .38) < .012 ? .15 : 1;
		const band = .35 + .65 * (.5 + .5 * Math.sin(u * Math.PI * 48));
		const n = hash2(x, y, 3);
		const alpha = cassini * gap2 * (.15 + band * .75) * (.85 + n * .15);
		const col = lerpColor(rgb(196, 178, 132), rgb(232, 220, 186), band);
		put(d, (y * w + x) * 4, col, Math.floor(alpha * 255));
	}
	ctx.putImageData(img, 0, 0);
	const tex = toTexture(c);
	tex.wrapS = ClampToEdgeWrapping;
	return tex;
}
function makeGlowTexture() {
	const { c, ctx, w } = canvas(256, 256);
	const g = ctx.createRadialGradient(w / 2, w / 2, 8, w / 2, w / 2, w / 2);
	g.addColorStop(0, "rgba(255, 244, 210, 0.95)");
	g.addColorStop(.18, "rgba(255, 196, 80, 0.55)");
	g.addColorStop(.42, "rgba(255, 140, 40, 0.16)");
	g.addColorStop(1, "rgba(255, 100, 0, 0)");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, w);
	const tex = toTexture(c);
	tex.wrapS = ClampToEdgeWrapping;
	return tex;
}
function makeSkyTexture() {
	const { c, ctx, w, h } = canvas(1024, 512);
	ctx.fillStyle = "#07080c";
	ctx.fillRect(0, 0, w, h);
	const img = ctx.getImageData(0, 0, w, h);
	const d = img.data;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const u = x / w;
		const v = y / h;
		const milky = Math.exp(-Math.pow((v - .5 - Math.sin(u * Math.PI * 2) * .04) * 5.5, 2));
		const dust = fbm(u * 4, v * 2, 77) * milky;
		const i = (y * w + x) * 4;
		d[i] = 7 + dust * 42;
		d[i + 1] = 8 + dust * 38;
		d[i + 2] = 12 + dust * 55;
		d[i + 3] = 255;
	}
	for (let i = 0; i < 2800; i++) {
		const x = Math.floor(hash2(i, 1, 9) * w);
		const y = Math.floor(hash2(i, 2, 9) * h);
		const b = 140 + hash2(i, 3, 9) * 115;
		const p = (y * w + x) * 4;
		d[p] = Math.min(255, d[p] + b);
		d[p + 1] = Math.min(255, d[p + 1] + b);
		d[p + 2] = Math.min(255, d[p + 2] + b * .95);
	}
	ctx.putImageData(img, 0, 0);
	const tex = toTexture(c);
	tex.wrapS = RepeatWrapping;
	tex.wrapT = RepeatWrapping;
	return tex;
}
var makers = {
	mercury: makeMercuryTexture,
	venus: makeVenusTexture,
	earth: makeEarthTexture,
	mars: makeMarsTexture,
	moon: makeMoonTexture,
	jupiter: makeJupiterTexture,
	saturn: makeSaturnTexture,
	uranus: makeUranusTexture,
	neptune: makeNeptuneTexture
};
function textureFor(id) {
	return (makers[id] ?? makeMoonTexture)();
}
var sunVert = `
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = mv.xyz;
  vPos = position;
  gl_Position = projectionMatrix * mv;
}
`;
var sunFrag = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

void main() {
  vec3 nrm = normalize(vNormal);
  vec3 view = normalize(-vView);
  float n = noise(vPos * 0.85 + vec3(uTime * 0.35, uTime * 0.12, -uTime * 0.2));
  n += 0.5 * noise(vPos * 1.8 - vec3(uTime * 0.2));
  vec3 hot = vec3(1.0, 0.92, 0.62);
  vec3 deep = vec3(0.92, 0.38, 0.05);
  vec3 col = mix(deep, hot, clamp(n, 0.0, 1.0));
  float fres = pow(1.0 - abs(dot(nrm, view)), 2.2);
  col += vec3(1.0, 0.85, 0.45) * fres * 0.55;
  gl_FragColor = vec4(col, 1.0);
}
`;
var atmosVert = `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;
var atmosFrag = `
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec3 nrm = normalize(vNormal);
  vec3 view = normalize(-vView);
  float fres = pow(1.0 - abs(dot(nrm, view)), 2.6);
  gl_FragColor = vec4(uColor, fres * 0.85);
}
`;
var _world = new Vector3();
var TAU = Math.PI * 2;
function useBodyRef(id) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		registerBody(id, ref.current);
		return () => registerBody(id, null);
	}, [id]);
	return ref;
}
function Atmosphere({ radius, color }) {
	const col = (0, import_react.useMemo)(() => new Color(color), [color]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		scale: 1.18,
		raycast: () => null,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			radius,
			32,
			32
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("shaderMaterial", {
			vertexShader: atmosVert,
			fragmentShader: atmosFrag,
			uniforms: { uColor: { value: col } },
			transparent: true,
			depthWrite: false,
			blending: 2,
			side: 1
		})]
	});
}
function BodyLabel({ name, visible }) {
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
		center: true,
		sprite: true,
		zIndexRange: [8, 0],
		style: { pointerEvents: "none" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "solar-label",
			children: name
		})
	});
}
function PlanetTrail({ objectRef, color }) {
	const n = 110;
	const geom = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		g.setAttribute("position", new Float32BufferAttribute(/* @__PURE__ */ new Float32Array(330), 3));
		return g;
	}, [n]);
	const mat = (0, import_react.useMemo)(() => new LineBasicMaterial({
		color,
		transparent: true,
		opacity: .5,
		depthWrite: false
	}), [color]);
	const line = (0, import_react.useMemo)(() => new Line(geom, mat), [geom, mat]);
	const primed = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		return () => {
			geom.dispose();
			mat.dispose();
		};
	}, [geom, mat]);
	useFrame(() => {
		if (!objectRef.current) return;
		if (useSim.getState().paused && primed.current) return;
		objectRef.current.getWorldPosition(_world);
		const attr = geom.getAttribute("position");
		const arr = attr.array;
		if (!primed.current) {
			for (let i = 0; i < n; i++) {
				arr[i * 3] = _world.x;
				arr[i * 3 + 1] = _world.y;
				arr[i * 3 + 2] = _world.z;
			}
			primed.current = true;
		} else {
			arr.copyWithin(0, 3);
			arr[arr.length - 3] = _world.x;
			arr[arr.length - 2] = _world.y;
			arr[arr.length - 1] = _world.z;
		}
		attr.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
		object: line,
		frustumCulled: false
	});
}
function MoonMesh({ moon, parentRadius }) {
	const ref = (0, import_react.useRef)(null);
	const tex = (0, import_react.useMemo)(() => textureFor("moon"), []);
	const selectable = Boolean(moon.selectable);
	(0, import_react.useLayoutEffect)(() => {
		if (!selectable) return;
		registerBody(moon.id, ref.current);
		return () => registerBody(moon.id, null);
	}, [moon.id, selectable]);
	(0, import_react.useEffect)(() => () => tex.dispose(), [tex]);
	useFrame(() => {
		if (!ref.current) return;
		const theta = moon.phase + clock.years / moon.periodYears * TAU;
		const d = moon.distance;
		ref.current.position.set(Math.cos(theta) * d, Math.sin(theta * .35) * d * .08, Math.sin(theta) * d);
	}, -4);
	const selected = useSim((s) => s.selected);
	const showLabels = useSim((s) => s.showLabels);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				onClick: (e) => {
					if (!selectable) return;
					e.stopPropagation();
					useSim.getState().select(moon.id);
				},
				onPointerOver: () => {
					if (selectable) document.body.style.cursor = "pointer";
				},
				onPointerOut: () => {
					document.body.style.cursor = "auto";
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					moon.radius,
					24,
					24
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: tex,
					color: moon.color,
					roughness: .9,
					metalness: .02,
					emissive: moon.color,
					emissiveIntensity: .03
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyLabel, {
				name: moon.name,
				visible: showLabels && selectable && (selected === moon.id || selected === "earth")
			}),
			selectable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				visible: false,
				raycast: Mesh.prototype.raycast,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					Math.max(parentRadius * .35, moon.radius * 2.4),
					8,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {})]
			}) : null
		]
	});
}
function OrbitPath({ body }) {
	const points = (0, import_react.useMemo)(() => {
		const pts = [];
		for (let i = 0; i <= 160; i++) {
			const theta = i / 160 * TAU;
			const p = orbitPoint(body.distance, body.eccentricity, theta);
			pts.push([
				p.x,
				0,
				p.z
			]);
		}
		return pts;
	}, [body.distance, body.eccentricity]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		rotation: [
			body.inclination,
			0,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line$1, {
			points,
			color: body.trail,
			transparent: true,
			opacity: .22,
			lineWidth: 1,
			dashed: false,
			raycast: () => null
		})
	});
}
function Planet({ body }) {
	const orbitRef = (0, import_react.useRef)(null);
	const bodyRef = useBodyRef(body.id);
	const spinRef = (0, import_react.useRef)(null);
	const tex = (0, import_react.useMemo)(() => textureFor(body.id), [body.id]);
	const ringTex = (0, import_react.useMemo)(() => body.id === "saturn" ? makeRingTexture() : null, [body.id]);
	const selected = useSim((s) => s.selected);
	const showLabels = useSim((s) => s.showLabels);
	const showTrails = useSim((s) => s.showTrails);
	(0, import_react.useEffect)(() => () => {
		tex.dispose();
		ringTex?.dispose();
	}, [tex, ringTex]);
	useFrame((_, delta) => {
		const dt = Math.min(delta, .1);
		const { speed, paused } = useSim.getState();
		if (!orbitRef.current || !bodyRef.current) return;
		const theta = body.phase + clock.years / body.periodYears * TAU;
		const p = orbitPoint(body.distance, body.eccentricity, theta);
		bodyRef.current.position.set(p.x, 0, p.z);
		if (!paused && spinRef.current) {
			const dir = body.spinDays < 0 ? -1 : 1;
			const period = Math.max(.35, Math.abs(body.spinDays) * .18);
			spinRef.current.rotation.y += dir * (TAU / (period * 8)) * dt * speed;
		}
	}, -4);
	const segs = body.kind === "gas" || body.kind === "ice" ? 48 : 32;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: orbitRef,
		rotation: [
			body.inclination,
			0,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: bodyRef,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
					ref: spinRef,
					rotation: [
						MathUtils.degToRad(body.tilt),
						0,
						0
					],
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
							onClick: (e) => {
								e.stopPropagation();
								useSim.getState().select(body.id);
							},
							onPointerOver: () => {
								document.body.style.cursor = "pointer";
							},
							onPointerOut: () => {
								document.body.style.cursor = "auto";
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
								body.radius,
								segs,
								segs
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
								map: tex,
								roughness: body.kind === "gas" ? .55 : .82,
								metalness: .04,
								emissive: body.color,
								emissiveIntensity: .045
							})]
						}),
						body.atmosphere ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atmosphere, {
							radius: body.radius,
							color: body.atmosphere
						}) : null,
						ringTex ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
							rotation: [
								Math.PI / 2,
								0,
								0
							],
							raycast: () => null,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
								body.radius * 1.35,
								body.radius * 2.35,
								80
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
								map: ringTex,
								transparent: true,
								side: 2,
								depthWrite: false,
								roughness: .7,
								metalness: .15
							})]
						}) : null,
						body.id === "uranus" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
							rotation: [
								Math.PI / 2,
								0,
								0
							],
							raycast: () => null,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
								body.radius * 1.45,
								body.radius * 1.85,
								48
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
								color: "#b7d8de",
								transparent: true,
								opacity: .18,
								side: 2,
								depthWrite: false
							})]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					visible: false,
					onClick: (e) => {
						e.stopPropagation();
						useSim.getState().select(body.id);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						body.radius * 2.1,
						12,
						12
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyLabel, {
					name: body.name,
					visible: showLabels && selected === null
				}),
				body.moons?.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoonMesh, {
					moon: m,
					parentRadius: body.radius
				}, m.id))
			]
		})
	}), showTrails ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanetTrail, {
		objectRef: bodyRef,
		color: body.trail
	}) : null] });
}
function Sun() {
	const ref = useBodyRef("sun");
	const mat = (0, import_react.useRef)(null);
	const glow = (0, import_react.useMemo)(() => makeGlowTexture(), []);
	const selected = useSim((s) => s.selected);
	const showLabels = useSim((s) => s.showLabels);
	(0, import_react.useEffect)(() => () => glow.dispose(), [glow]);
	useFrame(() => {
		if (mat.current) mat.current.uniforms.uTime.value = clock.years * 6;
	}, -4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				onClick: (e) => {
					e.stopPropagation();
					useSim.getState().select("sun");
				},
				onPointerOver: () => {
					document.body.style.cursor = "pointer";
				},
				onPointerOut: () => {
					document.body.style.cursor = "auto";
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					4.6,
					64,
					64
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("shaderMaterial", {
					ref: mat,
					vertexShader: sunVert,
					fragmentShader: sunFrag,
					uniforms: { uTime: { value: 0 } }
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
				scale: [
					16,
					16,
					1
				],
				raycast: () => null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
					map: glow,
					blending: 2,
					depthWrite: false,
					transparent: true,
					opacity: .85
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
				scale: [
					28,
					28,
					1
				],
				raycast: () => null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
					map: glow,
					blending: 2,
					depthWrite: false,
					transparent: true,
					opacity: .28
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				color: "#ffe8c2",
				intensity: 2.4,
				distance: 160,
				decay: 1.4
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyLabel, {
				name: "Sol",
				visible: showLabels && selected === null
			})
		]
	});
}
function AsteroidBelt() {
	const count = 380;
	const mesh = (0, import_react.useRef)(null);
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	(0, import_react.useLayoutEffect)(() => {
		if (!mesh.current) return;
		let seed = 42;
		const rnd = () => {
			seed = seed * 16807 % 2147483647;
			return (seed - 1) / 2147483646;
		};
		for (let i = 0; i < count; i++) {
			const a = rnd() * TAU;
			const r = 29.2 + rnd() * 4.6;
			dummy.position.set(Math.cos(a) * r, (rnd() - .5) * .55, Math.sin(a) * r);
			dummy.scale.setScalar(.035 + rnd() * .07);
			dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
			dummy.updateMatrix();
			mesh.current.setMatrixAt(i, dummy.matrix);
		}
		mesh.current.instanceMatrix.needsUpdate = true;
	}, [count, dummy]);
	useFrame((_, delta) => {
		const { paused, speed } = useSim.getState();
		if (!paused && mesh.current) mesh.current.rotation.y += Math.min(delta, .1) * speed * .018;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: mesh,
		args: [
			void 0,
			void 0,
			count
		],
		raycast: () => null,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("icosahedronGeometry", { args: [1, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#6a635a",
			roughness: .96,
			metalness: .04
		})]
	});
}
function SolarBodies({ bodies }) {
	const planets = bodies.filter((b) => b.id !== "sun");
	const showOrbits = useSim((s) => s.showOrbits);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {}),
		showOrbits ? planets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitPath, { body: b }, `orbit-${b.id}`)) : null,
		planets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Planet, { body: b }, b.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AsteroidBelt, {})
	] });
}
function SkyDome() {
	const tex = (0, import_react.useMemo)(() => makeSkyTexture(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		raycast: () => null,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			220,
			32,
			24
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			map: tex,
			side: 1,
			depthWrite: false
		})]
	});
}
function Starfield({ count = 1800 }) {
	const points = (0, import_react.useRef)(null);
	const geom = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const pos = new Float32Array(count * 3);
		const col = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const r = 90 + Math.random() * 80;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			pos[i * 3 + 1] = r * Math.cos(phi);
			pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
			const t = .75 + Math.random() * .25;
			const cool = Math.random();
			col[i * 3] = t;
			col[i * 3 + 1] = t * (.92 + cool * .08);
			col[i * 3 + 2] = t * (.85 + cool * .15);
		}
		g.setAttribute("position", new BufferAttribute(pos, 3));
		g.setAttribute("color", new BufferAttribute(col, 3));
		return g;
	}, [count]);
	useFrame((_, delta) => {
		const { paused, speed } = useSim.getState();
		if (!paused && points.current) points.current.rotation.y += Math.min(delta, .1) * speed * .003;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
		ref: points,
		geometry: geom,
		frustumCulled: false,
		raycast: () => null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
			size: .38,
			vertexColors: true,
			transparent: true,
			opacity: .9,
			sizeAttenuation: true,
			depthWrite: false
		})
	});
}
var _pos = new Vector3();
var _cam = new Vector3();
var _target = new Vector3();
function SimTicker() {
	const acc = (0, import_react.useRef)(0);
	useFrame((_, delta) => {
		const d = Math.min(delta, .1);
		const { paused, speed } = useSim.getState();
		if (!paused) clock.years += d * speed / 22;
		acc.current += d;
		if (acc.current > .12) {
			acc.current = 0;
			const y = clock.years;
			if (Math.abs(y - useSim.getState().years) > .001) useSim.setState({ years: y });
		}
	}, -6);
	return null;
}
function CameraRig() {
	const controls = (0, import_react.useRef)(null);
	const lastId = (0, import_react.useRef)(void 0);
	const lastTarget = (0, import_react.useRef)(new Vector3());
	const flying = (0, import_react.useRef)(false);
	const reduced = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}, []);
	useFrame((_, delta) => {
		const cc = controls.current;
		if (!cc) return;
		const id = useSim.getState().selected;
		const obj = id ? bodyRegistry.get(id) : null;
		if (obj) obj.getWorldPosition(_pos);
		else _pos.set(0, 0, 0);
		if (lastId.current !== id) {
			lastId.current = id;
			const dist = focusDistance(id);
			cc.getPosition(_cam);
			const offset = _cam.sub(_pos);
			offset.y = 0;
			if (offset.lengthSq() < .01) offset.set(.65, 0, .85);
			offset.normalize();
			const camX = _pos.x + offset.x * dist * .92;
			const camY = _pos.y + dist * .38;
			const camZ = _pos.z + offset.z * dist * .92;
			cc.setLookAt(camX, camY, camZ, _pos.x, _pos.y, _pos.z, !reduced.current);
			lastTarget.current.copy(_pos);
			flying.current = true;
			return;
		}
		if (flying.current) {
			lastTarget.current.copy(_pos);
			if (cc.active) return;
			flying.current = false;
		}
		const move = _target.copy(_pos).sub(lastTarget.current);
		if (move.lengthSq() > 0) {
			cc.getPosition(_cam);
			_cam.add(move);
			cc.setLookAt(_cam.x, _cam.y, _cam.z, _pos.x, _pos.y, _pos.z, false);
			lastTarget.current.copy(_pos);
		}
		if (id === null && !cc.active) cc.azimuthAngle += Math.min(delta, .1) * .05;
		cc.minDistance = id ? Math.max(2.2, focusDistance(id) * .35) : 18;
		cc.maxDistance = id ? focusDistance(id) * 4.5 : 140;
	}, -1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraControls, {
		ref: controls,
		makeDefault: true,
		smoothTime: .45,
		draggingSmoothTime: .12,
		azimuthRotateSpeed: .7,
		polarRotateSpeed: .7,
		dollySpeed: .85,
		minPolarAngle: .14,
		maxPolarAngle: Math.PI - .14,
		minDistance: 4,
		maxDistance: 140
	});
}
function Scene() {
	const starCount = (0, import_react.useMemo)(() => typeof window !== "undefined" && window.innerWidth < 640 ? 900 : 1800, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#07080c"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .07 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#1c2433",
			"#07080c",
			.22
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyDome, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, { count: starCount }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolarBodies, { bodies: BODIES }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimTicker, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {})
	] });
}
function SolarCanvas() {
	const drag = (0, import_react.useRef)({
		x: 0,
		y: 0,
		moved: false
	});
	const [ready, setReady] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			camera: {
				position: [
					22,
					18,
					52
				],
				fov: 42,
				near: .08,
				far: 420
			},
			dpr: [1, 1.75],
			gl: {
				antialias: true,
				alpha: false,
				powerPreference: "high-performance",
				toneMapping: 4,
				toneMappingExposure: 1.05
			},
			onCreated: ({ gl }) => {
				gl.setClearColor("#07080c");
				setReady(true);
			},
			onPointerDown: (e) => {
				drag.current = {
					x: e.clientX,
					y: e.clientY,
					moved: false
				};
			},
			onPointerMove: (e) => {
				if (Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 5) drag.current.moved = true;
			},
			onPointerMissed: () => {
				if (!drag.current.moved) useSim.getState().select(null);
			},
			className: "touch-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
		}), !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 flex items-center justify-center bg-bg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl tracking-tight text-fg",
				children: "Órbita"
			})
		}) : null]
	});
}
//#endregion
export { SolarCanvas };
