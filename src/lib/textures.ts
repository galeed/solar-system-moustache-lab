import * as THREE from "three";

function hash2(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 19.19) * 43758.5453;
  return n - Math.floor(n);
}

function valueNoise(x: number, y: number, seed: number) {
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

function fbm(x: number, y: number, seed: number, octaves = 5) {
  let v = 0;
  let a = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    v += a * valueNoise(x * f, y * f, seed + i * 13);
    a *= 0.5;
    f *= 2;
  }
  return v;
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  return { c, ctx, w, h };
}

function toTexture(c: HTMLCanvasElement) {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rgb(r: number, g: number, b: number) {
  return [r, g, b] as const;
}

function lerpColor(a: readonly [number, number, number], b: readonly [number, number, number], t: number) {
  return rgb(mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t));
}

function put(data: Uint8ClampedArray, i: number, col: readonly [number, number, number], a = 255) {
  data[i] = col[0];
  data[i + 1] = col[1];
  data[i + 2] = col[2];
  data[i + 3] = a;
}

function paintPixels(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fn: (x: number, y: number, u: number, v: number) => readonly [number, number, number],
) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const col = fn(x, y, x / w, y / h);
      put(d, (y * w + x) * 4, col);
    }
  }
  ctx.putImageData(img, 0, 0);
}

export function makeMercuryTexture() {
  const { c, ctx, w, h } = canvas(512, 256);
  paintPixels(ctx, w, h, (x, y, u, v) => {
    const n = fbm(u * 8, v * 4, 11);
    const crater = Math.pow(Math.max(0, 0.62 - fbm(u * 14, v * 7, 4)), 3);
    const base = lerpColor(rgb(78, 74, 70), rgb(168, 160, 150), n);
    const dark = lerpColor(base, rgb(42, 40, 38), crater * 4);
    const pole = Math.abs(v - 0.5) * 2;
    return lerpColor(dark, rgb(190, 186, 180), Math.max(0, pole - 0.88) * 4);
  });
  return toTexture(c);
}

export function makeVenusTexture() {
  const { c, ctx, w, h } = canvas(512, 256);
  paintPixels(ctx, w, h, (_x, _y, u, v) => {
    const swirl = fbm(u * 4 + Math.sin(v * 8) * 0.4, v * 6, 21);
    const band = 0.5 + 0.5 * Math.sin(v * 18 + swirl * 4);
    return lerpColor(rgb(196, 164, 96), rgb(236, 220, 176), swirl * 0.7 + band * 0.3);
  });
  return toTexture(c);
}

export function makeEarthTexture() {
  const { c, ctx, w, h } = canvas(1024, 512);
  paintPixels(ctx, w, h, (_x, _y, u, v) => {
    const n = fbm(u * 7, v * 4, 7);
    const n2 = fbm(u * 18, v * 10, 29);
    // Rough continent masks in equirectangular UV
    const blobs = [
      [0.18, 0.42, 0.13, 0.28],
      [0.22, 0.62, 0.09, 0.18],
      [0.52, 0.48, 0.11, 0.22],
      [0.58, 0.34, 0.2, 0.16],
      [0.72, 0.38, 0.16, 0.14],
      [0.84, 0.68, 0.07, 0.08],
      [0.08, 0.28, 0.16, 0.08],
    ];
    let land = 0;
    for (const [cx, cy, rx, ry] of blobs) {
      const dx = (u - cx) / rx;
      const dy = (v - cy) / ry;
      land = Math.max(land, 1 - (dx * dx + dy * dy));
    }
    land = Math.max(0, land * 1.15 - 0.18 - n * 0.22);
    const ice = Math.max(0, Math.abs(v - 0.5) * 2 - 0.78) * 4;
    const ocean = lerpColor(rgb(12, 42, 92), rgb(28, 92, 148), n * 0.6);
    const ground = lerpColor(rgb(46, 92, 42), rgb(142, 124, 72), n2);
    let col = land > 0.15 ? lerpColor(ocean, ground, Math.min(1, land)) : ocean;
    col = lerpColor(col, rgb(236, 242, 248), Math.min(1, ice));
    const cloud = Math.max(0, fbm(u * 10 + 2, v * 5, 90) - 0.55);
    col = lerpColor(col, rgb(245, 248, 252), cloud * 1.6);
    return col;
  });
  return toTexture(c);
}

export function makeMarsTexture() {
  const { c, ctx, w, h } = canvas(512, 256);
  paintPixels(ctx, w, h, (_x, _y, u, v) => {
    const n = fbm(u * 6, v * 4, 3);
    const maria = Math.max(0, fbm(u * 5, v * 3, 17) - 0.55);
    let col = lerpColor(rgb(140, 62, 36), rgb(196, 102, 58), n);
    col = lerpColor(col, rgb(86, 48, 36), maria * 2);
    const ice = Math.max(0, Math.abs(v - 0.5) * 2 - 0.82) * 5;
    col = lerpColor(col, rgb(232, 236, 240), Math.min(1, ice));
    return col;
  });
  return toTexture(c);
}

export function makeMoonTexture() {
  const { c, ctx, w, h } = canvas(256, 128);
  paintPixels(ctx, w, h, (_x, _y, u, v) => {
    const n = fbm(u * 8, v * 4, 44);
    const crater = Math.pow(Math.max(0, 0.58 - fbm(u * 16, v * 8, 8)), 2.4);
    const base = lerpColor(rgb(92, 90, 86), rgb(188, 184, 176), n);
    return lerpColor(base, rgb(48, 46, 44), crater * 3);
  });
  return toTexture(c);
}

export function makeJupiterTexture() {
  const { c, ctx, w, h } = canvas(1024, 512);
  paintPixels(ctx, w, h, (_x, _y, u, v) => {
    const swirl = fbm(u * 6, v * 18, 5);
    const band = Math.sin((v + swirl * 0.04) * Math.PI * 14);
    const cream = rgb(232, 210, 170);
    const rust = rgb(176, 108, 62);
    const white = rgb(244, 236, 214);
    let col = lerpColor(cream, rust, 0.5 + 0.5 * band);
    col = lerpColor(col, white, Math.max(0, swirl - 0.55) * 1.4);
    // Great Red Spot
    const dx = (u - 0.72) / 0.08;
    const dy = (v - 0.58) / 0.05;
    const spot = Math.max(0, 1 - (dx * dx + dy * dy));
    col = lerpColor(col, rgb(188, 64, 42), Math.pow(spot, 1.4));
    return col;
  });
  return toTexture(c);
}

export function makeSaturnTexture() {
  const { c, ctx, w, h } = canvas(1024, 512);
  paintPixels(ctx, w, h, (_x, _y, u, v) => {
    const swirl = fbm(u * 5, v * 16, 12);
    const band = Math.sin((v + swirl * 0.03) * Math.PI * 12);
    const pale = rgb(236, 220, 176);
    const tan = rgb(196, 164, 108);
    return lerpColor(pale, tan, 0.45 + 0.45 * band);
  });
  return toTexture(c);
}

export function makeUranusTexture() {
  const { c, ctx, w, h } = canvas(512, 256);
  paintPixels(ctx, w, h, (_x, _y, u, v) => {
    const n = fbm(u * 3, v * 4, 31);
    return lerpColor(rgb(110, 188, 196), rgb(168, 224, 228), n * 0.55 + (0.5 - Math.abs(v - 0.5)) * 0.3);
  });
  return toTexture(c);
}

export function makeNeptuneTexture() {
  const { c, ctx, w, h } = canvas(512, 256);
  paintPixels(ctx, w, h, (_x, _y, u, v) => {
    const n = fbm(u * 5, v * 8, 19);
    const band = 0.5 + 0.5 * Math.sin(v * 10 + n * 2);
    let col = lerpColor(rgb(28, 62, 156), rgb(72, 130, 214), n * 0.6 + band * 0.25);
    const dx = (u - 0.35) / 0.07;
    const dy = (v - 0.42) / 0.045;
    const spot = Math.max(0, 1 - (dx * dx + dy * dy));
    col = lerpColor(col, rgb(18, 36, 92), spot);
    const streak = Math.max(0, fbm(u * 12, v * 3, 2) - 0.62);
    col = lerpColor(col, rgb(210, 228, 255), streak * 1.8);
    return col;
  });
  return toTexture(c);
}

export function makeRingTexture() {
  const { c, ctx, w, h } = canvas(1024, 64);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const cassini = Math.abs(u - 0.62) < 0.035 ? 0 : 1;
      const gap2 = Math.abs(u - 0.38) < 0.012 ? 0.15 : 1;
      const band = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(u * Math.PI * 48));
      const n = hash2(x, y, 3);
      const alpha = cassini * gap2 * (0.15 + band * 0.75) * (0.85 + n * 0.15);
      const col = lerpColor(rgb(196, 178, 132), rgb(232, 220, 186), band);
      put(d, (y * w + x) * 4, col, Math.floor(alpha * 255));
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = toTexture(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  return tex;
}

export function makeGlowTexture() {
  const { c, ctx, w } = canvas(256, 256);
  const g = ctx.createRadialGradient(w / 2, w / 2, 8, w / 2, w / 2, w / 2);
  g.addColorStop(0, "rgba(255, 244, 210, 0.95)");
  g.addColorStop(0.18, "rgba(255, 196, 80, 0.55)");
  g.addColorStop(0.42, "rgba(255, 140, 40, 0.16)");
  g.addColorStop(1, "rgba(255, 100, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, w);
  const tex = toTexture(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  return tex;
}

export function makeSkyTexture() {
  const { c, ctx, w, h } = canvas(1024, 512);
  ctx.fillStyle = "#07080c";
  ctx.fillRect(0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const v = y / h;
      const milky = Math.exp(-Math.pow((v - 0.5 - Math.sin(u * Math.PI * 2) * 0.04) * 5.5, 2));
      const dust = fbm(u * 4, v * 2, 77) * milky;
      const i = (y * w + x) * 4;
      d[i] = 7 + dust * 42;
      d[i + 1] = 8 + dust * 38;
      d[i + 2] = 12 + dust * 55;
      d[i + 3] = 255;
    }
  }
  // Stars
  for (let i = 0; i < 2800; i++) {
    const x = Math.floor(hash2(i, 1, 9) * w);
    const y = Math.floor(hash2(i, 2, 9) * h);
    const b = 140 + hash2(i, 3, 9) * 115;
    const p = (y * w + x) * 4;
    d[p] = Math.min(255, d[p] + b);
    d[p + 1] = Math.min(255, d[p + 1] + b);
    d[p + 2] = Math.min(255, d[p + 2] + b * 0.95);
  }
  ctx.putImageData(img, 0, 0);
  const tex = toTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const makers: Record<string, () => THREE.CanvasTexture> = {
  mercury: makeMercuryTexture,
  venus: makeVenusTexture,
  earth: makeEarthTexture,
  mars: makeMarsTexture,
  moon: makeMoonTexture,
  jupiter: makeJupiterTexture,
  saturn: makeSaturnTexture,
  uranus: makeUranusTexture,
  neptune: makeNeptuneTexture,
};

export function textureFor(id: string) {
  const make = makers[id] ?? makeMoonTexture;
  return make();
}
