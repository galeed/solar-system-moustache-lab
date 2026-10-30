import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeSkyTexture } from "@/lib/textures";
import { useSim } from "@/store/sim";

export function SkyDome() {
  const tex = useMemo(() => makeSkyTexture(), []);
  return (
    <mesh raycast={() => null}>
      <sphereGeometry args={[220, 32, 24]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

export function Starfield({ count = 1800 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 90 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const t = 0.75 + Math.random() * 0.25;
      const cool = Math.random();
      col[i * 3] = t;
      col[i * 3 + 1] = t * (0.92 + cool * 0.08);
      col[i * 3 + 2] = t * (0.85 + cool * 0.15);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);

  useFrame((_, delta) => {
    const { paused, speed } = useSim.getState();
    if (!paused && points.current) {
      points.current.rotation.y += Math.min(delta, 0.1) * speed * 0.003;
    }
  });

  return (
    <points ref={points} geometry={geom} frustumCulled={false} raycast={() => null}>
      <pointsMaterial
        size={0.38}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
