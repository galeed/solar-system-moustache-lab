import { create, type StoreApi, type UseBoundStore } from "zustand";

export type BodyId =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "moon"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

interface SimState {
  paused: boolean;
  speed: number;
  selected: BodyId | null;
  showLabels: boolean;
  showOrbits: boolean;
  showTrails: boolean;
  years: number;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  select: (id: BodyId | null) => void;
  toggleLabels: () => void;
  toggleOrbits: () => void;
  toggleTrails: () => void;
}

type SimStore = UseBoundStore<StoreApi<SimState>>;

const createSim = () =>
  create<SimState>((set) => ({
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
    toggleTrails: () => set((s) => ({ showTrails: !s.showTrails })),
  }));

const globalRef = globalThis as typeof globalThis & { __orbitaSim?: SimStore };

export const useSim: SimStore = globalRef.__orbitaSim ?? (globalRef.__orbitaSim = createSim());
