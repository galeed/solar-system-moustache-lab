export const sunVert = /* glsl */ `
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

export const sunFrag = /* glsl */ `
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

export const atmosVert = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const atmosFrag = /* glsl */ `
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
