import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import { BODIES, focusDistance } from "@/lib/planet-data";
import { clock, YEAR_DURATION } from "@/lib/clock";
import { bodyRegistry } from "@/lib/registry";
import { useSim } from "@/store/sim";
import { SolarBodies } from "@/components/solar/bodies";
import { SkyDome, Starfield } from "@/components/solar/starfield";

const _pos = new THREE.Vector3();
const _cam = new THREE.Vector3();
const _target = new THREE.Vector3();

function SimTicker() {
  const acc = useRef(0);
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const { paused, speed } = useSim.getState();
    if (!paused) clock.years += (d * speed) / YEAR_DURATION;
    acc.current += d;
    if (acc.current > 0.12) {
      acc.current = 0;
      const y = clock.years;
      if (Math.abs(y - useSim.getState().years) > 0.001) {
        useSim.setState({ years: y });
      }
    }
  }, -6);
  return null;
}

function CameraRig() {
  const controls = useRef<CameraControls>(null);
  const lastId = useRef<string | null | undefined>(undefined);
  const lastTarget = useRef(new THREE.Vector3());
  const flying = useRef(false);
  const reduced = useRef(false);

  useEffect(() => {
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
      if (offset.lengthSq() < 0.01) offset.set(0.65, 0, 0.85);
      offset.normalize();
      const camX = _pos.x + offset.x * dist * 0.92;
      const camY = _pos.y + dist * 0.38;
      const camZ = _pos.z + offset.z * dist * 0.92;
      void cc.setLookAt(camX, camY, camZ, _pos.x, _pos.y, _pos.z, !reduced.current);
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

    if (id === null && !cc.active) {
      cc.azimuthAngle += Math.min(delta, 0.1) * 0.05;
    }

    cc.minDistance = id ? Math.max(2.2, focusDistance(id) * 0.35) : 18;
    cc.maxDistance = id ? focusDistance(id) * 4.5 : 140;
  }, -1);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={0.45}
      draggingSmoothTime={0.12}
      azimuthRotateSpeed={0.7}
      polarRotateSpeed={0.7}
      dollySpeed={0.85}
      minPolarAngle={0.14}
      maxPolarAngle={Math.PI - 0.14}
      minDistance={4}
      maxDistance={140}
    />
  );
}

function Scene() {
  const starCount = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth < 640 ? 900 : 1800),
    [],
  );

  return (
    <>
      <color attach="background" args={["#07080c"]} />
      <ambientLight intensity={0.07} />
      <hemisphereLight args={["#1c2433", "#07080c", 0.22]} />
      <SkyDome />
      <Starfield count={starCount} />
      <SolarBodies bodies={BODIES} />
      <SimTicker />
      <CameraRig />
    </>
  );
}

export function SolarCanvas() {
  const drag = useRef({ x: 0, y: 0, moved: false });
  const [ready, setReady] = useState(false);

  return (
    <div className="absolute inset-0 bg-bg">
      <Canvas
        camera={{ position: [22, 18, 52], fov: 42, near: 0.08, far: 420 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#07080c");
          setReady(true);
        }}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY, moved: false };
        }}
        onPointerMove={(e) => {
          if (Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 5) {
            drag.current.moved = true;
          }
        }}
        onPointerMissed={() => {
          if (!drag.current.moved) useSim.getState().select(null);
        }}
        className="touch-none"
      >
        <Scene />
      </Canvas>
      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center bg-bg">
          <p className="font-display text-xl tracking-tight text-fg">Órbita</p>
        </div>
      ) : null}
    </div>
  );
}
