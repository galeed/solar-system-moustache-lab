import type { Object3D } from "three";

export const bodyRegistry = new Map<string, Object3D>();

export function registerBody(id: string, obj: Object3D | null) {
  if (obj) bodyRegistry.set(id, obj);
  else bodyRegistry.delete(id);
}
