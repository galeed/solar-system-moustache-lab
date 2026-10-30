import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { clock } from "@/lib/clock";
import { orbitPoint, type BodyData, type MoonData } from "@/lib/planet-data";
import { registerBody } from "@/lib/registry";
import {
  makeGlowTexture,
  makeRingTexture,
  textureFor,
} from "@/lib/textures";
import { atmosFrag, atmosVert, sunFrag, sunVert } from "@/components/solar/shaders";
import { useSim, type BodyId } from "@/store/sim";

const _world = new THREE.Vector3();
const TAU = Math.PI * 2;

function useBodyRef(id: string) {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    registerBody(id, ref.current);
    return () => registerBody(id, null);
  }, [id]);
  return ref;
}

function Atmosphere({
  radius,
  color,
}: {
  radius: number;
  color: string;
}) {
  const col = useMemo(() => new THREE.Color(color), [color]);
  return (
    <mesh scale={1.18} raycast={() => null}>
      <sphereGeometry args={[radius, 32, 32]} />
      <shaderMaterial
        vertexShader={atmosVert}
        fragmentShader={atmosFrag}
        uniforms={{ uColor: { value: col } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function BodyLabel({ name, visible }: { name: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <Html center sprite zIndexRange={[8, 0]} style={{ pointerEvents: "none" }}>
      <div className="solar-label">{name}</div>
    </Html>
  );
}

function PlanetTrail({
  objectRef,
  color,
}: {
  objectRef: RefObject<THREE.Object3D | null>;
  color: string;
}) {
  const n = 110;
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    return g;
  }, [n]);
  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    [color],
  );
  const line = useMemo(() => new THREE.Line(geom, mat), [geom, mat]);
  const primed = useRef(false);

  useEffect(() => {
    return () => {
      geom.dispose();
      mat.dispose();
    };
  }, [geom, mat]);

  useFrame(() => {
    if (!objectRef.current) return;
    if (useSim.getState().paused && primed.current) return;
    objectRef.current.getWorldPosition(_world);
    const attr = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
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

  return <primitive object={line} frustumCulled={false} />;
}

function MoonMesh({ moon, parentRadius }: { moon: MoonData; parentRadius: number }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(() => textureFor("moon"), []);
  const selectable = Boolean(moon.selectable);

  useLayoutEffect(() => {
    if (!selectable) return;
    registerBody(moon.id, ref.current);
    return () => registerBody(moon.id, null);
  }, [moon.id, selectable]);

  useEffect(() => () => tex.dispose(), [tex]);

  useFrame(() => {
    if (!ref.current) return;
    const theta = moon.phase + (clock.years / moon.periodYears) * TAU;
    const d = moon.distance;
    ref.current.position.set(Math.cos(theta) * d, Math.sin(theta * 0.35) * d * 0.08, Math.sin(theta) * d);
  }, -4);

  const selected = useSim((s) => s.selected);
  const showLabels = useSim((s) => s.showLabels);

  return (
    <group ref={ref}>
      <mesh
        onClick={(e) => {
          if (!selectable) return;
          e.stopPropagation();
          useSim.getState().select(moon.id as BodyId);
        }}
        onPointerOver={() => {
          if (selectable) document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[moon.radius, 24, 24]} />
        <meshStandardMaterial
          map={tex}
          color={moon.color}
          roughness={0.9}
          metalness={0.02}
          emissive={moon.color}
          emissiveIntensity={0.03}
        />
      </mesh>
      <BodyLabel
        name={moon.name}
        visible={showLabels && selectable && (selected === moon.id || selected === "earth")}
      />
      {selectable ? (
        <mesh visible={false} raycast={THREE.Mesh.prototype.raycast}>
          <sphereGeometry args={[Math.max(parentRadius * 0.35, moon.radius * 2.4), 8, 8]} />
          <meshBasicMaterial />
        </mesh>
      ) : null}
    </group>
  );
}

function OrbitPath({ body }: { body: BodyData }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 160; i++) {
      const theta = (i / 160) * TAU;
      const p = orbitPoint(body.distance, body.eccentricity, theta);
      pts.push([p.x, 0, p.z]);
    }
    return pts;
  }, [body.distance, body.eccentricity]);

  return (
    <group rotation={[body.inclination, 0, 0]}>
      <Line
        points={points}
        color={body.trail}
        transparent
        opacity={0.22}
        lineWidth={1}
        dashed={false}
        raycast={() => null}
      />
    </group>
  );
}

function Planet({ body }: { body: BodyData }) {
  const orbitRef = useRef<THREE.Group>(null);
  const bodyRef = useBodyRef(body.id);
  const spinRef = useRef<THREE.Group>(null);
  const tex = useMemo(() => textureFor(body.id), [body.id]);
  const ringTex = useMemo(() => (body.id === "saturn" ? makeRingTexture() : null), [body.id]);
  const selected = useSim((s) => s.selected);
  const showLabels = useSim((s) => s.showLabels);
  const showTrails = useSim((s) => s.showTrails);

  useEffect(
    () => () => {
      tex.dispose();
      ringTex?.dispose();
    },
    [tex, ringTex],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const { speed, paused } = useSim.getState();
    if (!orbitRef.current || !bodyRef.current) return;
    const theta = body.phase + (clock.years / body.periodYears) * TAU;
    const p = orbitPoint(body.distance, body.eccentricity, theta);
    bodyRef.current.position.set(p.x, 0, p.z);
    if (!paused && spinRef.current) {
      const dir = body.spinDays < 0 ? -1 : 1;
      const period = Math.max(0.35, Math.abs(body.spinDays) * 0.18);
      spinRef.current.rotation.y += dir * (TAU / (period * 8)) * dt * speed;
    }
  }, -4);

  const segs = body.kind === "gas" || body.kind === "ice" ? 48 : 32;

  return (
    <>
      <group ref={orbitRef} rotation={[body.inclination, 0, 0]}>
        <group ref={bodyRef}>
          <group ref={spinRef} rotation={[THREE.MathUtils.degToRad(body.tilt), 0, 0]}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                useSim.getState().select(body.id);
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <sphereGeometry args={[body.radius, segs, segs]} />
              <meshStandardMaterial
                map={tex}
                roughness={body.kind === "gas" ? 0.55 : 0.82}
                metalness={0.04}
                emissive={body.color}
                emissiveIntensity={0.045}
              />
            </mesh>
            {body.atmosphere ? <Atmosphere radius={body.radius} color={body.atmosphere} /> : null}
            {ringTex ? (
              <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
                <ringGeometry args={[body.radius * 1.35, body.radius * 2.35, 80]} />
                <meshStandardMaterial
                  map={ringTex}
                  transparent
                  side={THREE.DoubleSide}
                  depthWrite={false}
                  roughness={0.7}
                  metalness={0.15}
                />
              </mesh>
            ) : null}
            {body.id === "uranus" ? (
              <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
                <ringGeometry args={[body.radius * 1.45, body.radius * 1.85, 48]} />
                <meshBasicMaterial
                  color="#b7d8de"
                  transparent
                  opacity={0.18}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            ) : null}
          </group>
          <mesh
            visible={false}
            onClick={(e) => {
              e.stopPropagation();
              useSim.getState().select(body.id);
            }}
          >
            <sphereGeometry args={[body.radius * 2.1, 12, 12]} />
            <meshBasicMaterial />
          </mesh>
          <BodyLabel name={body.name} visible={showLabels && selected === null} />
          {body.moons?.map((m) => (
            <MoonMesh key={m.id} moon={m} parentRadius={body.radius} />
          ))}
        </group>
      </group>
      {showTrails ? <PlanetTrail objectRef={bodyRef} color={body.trail} /> : null}
    </>
  );
}

function Sun() {
  const ref = useBodyRef("sun");
  const mat = useRef<THREE.ShaderMaterial>(null);
  const glow = useMemo(() => makeGlowTexture(), []);
  const selected = useSim((s) => s.selected);
  const showLabels = useSim((s) => s.showLabels);

  useEffect(() => () => glow.dispose(), [glow]);

  useFrame(() => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.years * 6;
  }, -4);

  return (
    <group ref={ref}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          useSim.getState().select("sun");
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[4.6, 64, 64]} />
        <shaderMaterial
          ref={mat}
          vertexShader={sunVert}
          fragmentShader={sunFrag}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>
      <sprite scale={[16, 16, 1]} raycast={() => null}>
        <spriteMaterial
          map={glow}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          opacity={0.85}
        />
      </sprite>
      <sprite scale={[28, 28, 1]} raycast={() => null}>
        <spriteMaterial
          map={glow}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          opacity={0.28}
        />
      </sprite>
      <pointLight color="#ffe8c2" intensity={2.4} distance={160} decay={1.4} />
      <BodyLabel name="Sol" visible={showLabels && selected === null} />
    </group>
  );
}

function AsteroidBelt() {
  const count = 380;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    let seed = 42;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      const a = rnd() * TAU;
      const r = 29.2 + rnd() * 4.6;
      dummy.position.set(Math.cos(a) * r, (rnd() - 0.5) * 0.55, Math.sin(a) * r);
      dummy.scale.setScalar(0.035 + rnd() * 0.07);
      dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  useFrame((_, delta) => {
    const { paused, speed } = useSim.getState();
    if (!paused && mesh.current) {
      mesh.current.rotation.y += Math.min(delta, 0.1) * speed * 0.018;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} raycast={() => null}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6a635a" roughness={0.96} metalness={0.04} />
    </instancedMesh>
  );
}

export function SolarBodies({ bodies }: { bodies: BodyData[] }) {
  const planets = bodies.filter((b) => b.id !== "sun");
  const showOrbits = useSim((s) => s.showOrbits);

  return (
    <>
      <Sun />
      {showOrbits
        ? planets.map((b) => <OrbitPath key={`orbit-${b.id}`} body={b} />)
        : null}
      {planets.map((b) => (
        <Planet key={b.id} body={b} />
      ))}
      <AsteroidBelt />
    </>
  );
}
