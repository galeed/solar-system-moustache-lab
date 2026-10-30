import type { BodyId } from "@/store/sim";

export type BodyKind = "star" | "rocky" | "gas" | "ice" | "moon";

export interface MoonData {
  id: string;
  name: string;
  radius: number;
  distance: number;
  periodYears: number;
  phase: number;
  color: string;
  selectable?: boolean;
}

export interface BodyData {
  id: BodyId;
  name: string;
  kind: BodyKind;
  radius: number;
  distance: number;
  eccentricity: number;
  inclination: number;
  tilt: number;
  /** Visual orbit period in compressed Earth-years. */
  periodYears: number;
  spinDays: number;
  phase: number;
  color: string;
  trail: string;
  atmosphere?: string;
  moons?: MoonData[];
  real: {
    type: string;
    distance: string;
    period: string;
    diameter: string;
    gravity: string;
    moons: string;
    fact: string;
  };
}

const visualPeriod = (realYears: number) => Math.pow(realYears, 0.48);

export const BODIES: BodyData[] = [
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
      fact: "Contiene el 99.8% de la masa del sistema solar. En su núcleo, el hidrógeno se fusiona en helio a 15 millones de °C.",
    },
  },
  {
    id: "mercury",
    name: "Mercurio",
    kind: "rocky",
    radius: 0.36,
    distance: 11.2,
    eccentricity: 0.206,
    inclination: 0.122,
    tilt: 0.03,
    periodYears: visualPeriod(0.241),
    spinDays: 58.6,
    phase: 0.4,
    color: "#9a938c",
    trail: "#b8b0a6",
    real: {
      type: "Planeta rocoso",
      distance: "0.39 UA · 58 millones de km",
      period: "88 días terrestres",
      diameter: "4,879 km",
      gravity: "3.7 m/s²",
      moons: "Ninguna",
      fact: "El más cercano al Sol y el más cráterizado. Un día mercuriano dura más que su año: 59 días contra 88.",
    },
  },
  {
    id: "venus",
    name: "Venus",
    kind: "rocky",
    radius: 0.68,
    distance: 15.4,
    eccentricity: 0.007,
    inclination: 0.059,
    tilt: 177.4,
    periodYears: visualPeriod(0.615),
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
      fact: "Gira al revés. Su atmósfera de CO₂ produce un efecto invernadero extremo: 464 °C en la superficie, más que Mercurio.",
    },
  },
  {
    id: "earth",
    name: "Tierra",
    kind: "rocky",
    radius: 0.72,
    distance: 20.2,
    eccentricity: 0.017,
    inclination: 0,
    tilt: 23.44,
    periodYears: 1,
    spinDays: 1,
    phase: 2.7,
    color: "#3d7cc9",
    trail: "#7eb6e8",
    atmosphere: "#6ea8e6",
    moons: [
      {
        id: "moon",
        name: "Luna",
        radius: 0.2,
        distance: 1.7,
        periodYears: 0.09,
        phase: 0.6,
        color: "#c9c6bf",
        selectable: true,
      },
    ],
    real: {
      type: "Planeta rocoso",
      distance: "1 UA · 150 millones de km",
      period: "365.25 días",
      diameter: "12,742 km",
      gravity: "9.8 m/s²",
      moons: "1",
      fact: "El único mundo conocido con vida. El 71% de su superficie es agua líquida, sostenida por una distancia justa al Sol.",
    },
  },
  {
    id: "mars",
    name: "Marte",
    kind: "rocky",
    radius: 0.46,
    distance: 25.6,
    eccentricity: 0.093,
    inclination: 0.032,
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
      fact: "El planeta rojo debe su color al óxido de hierro. Alberga Olympus Mons, el volcán más alto del sistema solar.",
    },
  },
  {
    id: "jupiter",
    name: "Júpiter",
    kind: "gas",
    radius: 2.05,
    distance: 38.4,
    eccentricity: 0.049,
    inclination: 0.023,
    tilt: 3.13,
    periodYears: visualPeriod(11.86),
    spinDays: 0.41,
    phase: 0.8,
    color: "#d9b48a",
    trail: "#e0c19a",
    atmosphere: "#e8d2ae",
    moons: [
      { id: "io", name: "Ío", radius: 0.09, distance: 2.55, periodYears: 0.018, phase: 0.2, color: "#e8c36a" },
      { id: "europa", name: "Europa", radius: 0.08, distance: 3.15, periodYears: 0.032, phase: 1.4, color: "#d9d4c8" },
      { id: "ganymede", name: "Ganimedes", radius: 0.11, distance: 3.85, periodYears: 0.055, phase: 2.6, color: "#a89b88" },
      { id: "callisto", name: "Calisto", radius: 0.1, distance: 4.65, periodYears: 0.09, phase: 3.5, color: "#7a7368" },
    ],
    real: {
      type: "Gigante gaseoso",
      distance: "5.2 UA · 778 millones de km",
      period: "11.86 años",
      diameter: "139,820 km",
      gravity: "24.8 m/s²",
      moons: "95+",
      fact: "El más masivo de los planetas. Su Gran Mancha Roja es una tormenta mayor que la Tierra, activa desde al menos 1830.",
    },
  },
  {
    id: "saturn",
    name: "Saturno",
    kind: "gas",
    radius: 1.72,
    distance: 49.2,
    eccentricity: 0.057,
    inclination: 0.043,
    tilt: 26.73,
    periodYears: visualPeriod(29.45),
    spinDays: 0.45,
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
      fact: "Sus anillos se extienden cientos de miles de kilómetros y tienen apenas decenas de metros de espesor. Flotaría en agua.",
    },
  },
  {
    id: "uranus",
    name: "Urano",
    kind: "ice",
    radius: 1.08,
    distance: 59.4,
    eccentricity: 0.046,
    inclination: 0.013,
    tilt: 97.77,
    periodYears: visualPeriod(84.0),
    spinDays: -0.72,
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
      fact: "Rueda de lado: su eje está inclinado 98°. Cada polo pasa 42 años en luz continua y 42 en oscuridad.",
    },
  },
  {
    id: "neptune",
    name: "Neptuno",
    kind: "ice",
    radius: 1.04,
    distance: 69.2,
    eccentricity: 0.01,
    inclination: 0.031,
    tilt: 28.32,
    periodYears: visualPeriod(164.8),
    spinDays: 0.67,
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
      fact: "El más lejano y el más ventoso. Sus vientos superan los 2,000 km/h, los más rápidos del sistema solar.",
    },
  },
];

export const MOON_INFO = {
  id: "moon" as const,
  name: "Luna",
  color: "#c9c6bf",
  real: {
    type: "Satélite natural",
    distance: "384,400 km de la Tierra",
    period: "27.3 días",
    diameter: "3,475 km",
    gravity: "1.6 m/s²",
    moons: "—",
    fact: "Siempre muestra la misma cara a la Tierra. Sus mareas frenan nuestro día y estabilizan el eje terrestre.",
  },
};

export const FOCUSABLE: BodyId[] = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];

export const bodyById = Object.fromEntries(BODIES.map((b) => [b.id, b])) as Record<
  BodyId,
  BodyData
>;

export function focusDistance(id: BodyId | null): number {
  if (!id) return 58;
  if (id === "moon") return 3.4;
  const body = bodyById[id];
  if (!body) return 58;
  if (body.id === "sun") return 16;
  if (body.kind === "gas") return body.radius * 5.4;
  if (body.kind === "ice") return body.radius * 6.2;
  return Math.max(4.2, body.radius * 7.5);
}

export function orbitPoint(distance: number, eccentricity: number, theta: number) {
  const r =
    (distance * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(theta));
  return { x: Math.cos(theta) * r, z: Math.sin(theta) * r, r };
}
