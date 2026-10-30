import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  Spline,
} from "lucide-react";
import { BODIES, FOCUSABLE, MOON_INFO, bodyById } from "@/lib/planet-data";
import { clock } from "@/lib/clock";
import { cn } from "@/lib/utils";
import { useSim } from "@/store/sim";

const SPEED_MIN = -2;
const SPEED_MAX = 5;

function speedFromSlider(t: number) {
  return Math.pow(2, t);
}

function sliderFromSpeed(speed: number) {
  return Math.log2(speed);
}

function formatSpeed(speed: number) {
  if (speed < 1) return `${speed.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}×`;
  if (speed < 10) return `${speed % 1 === 0 ? speed.toFixed(0) : speed.toFixed(1)}×`;
  return `${Math.round(speed)}×`;
}

function InfoPanel() {
  const selected = useSim((s) => s.selected);
  const select = useSim((s) => s.select);

  const data = useMemo(() => {
    if (!selected) return null;
    if (selected === "moon") return { name: MOON_INFO.name, color: MOON_INFO.color, real: MOON_INFO.real };
    const body = bodyById[selected];
    if (!body) return null;
    return { name: body.name, color: body.color, real: body.real };
  }, [selected]);

  if (!data) return null;

  return (
    <aside
      className={cn(
        "pointer-events-auto w-full rounded-xl bg-surface/95 p-4 shadow-border",
        "max-h-[42vh] overflow-y-auto md:max-h-[min(70vh,36rem)] md:w-80",
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-widest text-subtle">Foco</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg text-balance">
              {data.name}
            </h2>
          </div>
          <span
            className="mt-1 size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: data.color }}
            aria-hidden
          />
        </div>
        <p className="text-sm text-muted">{data.real.type}</p>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-border pt-3">
          <InfoRow label="Distancia" value={data.real.distance} />
          <InfoRow label="Periodo" value={data.real.period} />
          <InfoRow label="Diámetro" value={data.real.diameter} />
          <InfoRow label="Gravedad" value={data.real.gravity} />
          <InfoRow label="Satélites" value={data.real.moons} />
        </dl>
        <p className="text-pretty text-sm leading-snug text-muted">{data.real.fact}</p>
        <button
          type="button"
          onClick={() => select(null)}
          className="h-11 rounded-md bg-raised px-3 text-sm font-medium text-fg shadow-border transition-colors duration-[var(--motion-quick)] hover:bg-raised/80"
        >
          Vista general
        </button>
      </div>
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-xs uppercase tracking-wider text-subtle">{label}</dt>
      <dd className="truncate text-sm text-fg">{value}</dd>
    </div>
  );
}

function Toggle({
  pressed,
  onPressed,
  label,
  icon: Icon,
}: {
  pressed: boolean;
  onPressed: () => void;
  label: string;
  icon: typeof Eye;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      onClick={onPressed}
      className={cn(
        "inline-flex h-11 min-w-11 items-center justify-center rounded-md px-2.5 text-sm font-medium shadow-border transition-colors duration-[var(--motion-quick)]",
        pressed ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
      )}
    >
      <Icon className="size-4" strokeWidth={1.75} />
      <span className="ml-2 hidden lg:inline">{label}</span>
    </button>
  );
}

export function Hud() {
  const paused = useSim((s) => s.paused);
  const speed = useSim((s) => s.speed);
  const years = useSim((s) => s.years);
  const selected = useSim((s) => s.selected);
  const showLabels = useSim((s) => s.showLabels);
  const showOrbits = useSim((s) => s.showOrbits);
  const showTrails = useSim((s) => s.showTrails);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        useSim.getState().togglePause();
      } else if (e.code === "Escape") {
        useSim.getState().select(null);
      } else if (e.key === "+" || e.key === "=") {
        const next = Math.min(SPEED_MAX, sliderFromSpeed(useSim.getState().speed) + 0.5);
        useSim.getState().setSpeed(speedFromSlider(next));
      } else if (e.key === "-" || e.key === "_") {
        const next = Math.max(SPEED_MIN, sliderFromSpeed(useSim.getState().speed) - 0.5);
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

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <header className="absolute left-3 top-3 z-20 sm:left-5 sm:top-5">
        <div className="pointer-events-auto rounded-lg bg-surface/90 px-4 py-3 shadow-border">
          <p className="font-display text-xl font-semibold tracking-tight text-fg">Órbita</p>
          <p className="font-mono text-xs tabular-nums text-subtle">
            Año {years.toFixed(2)}
            {paused ? " · en pausa" : ""}
          </p>
        </div>
      </header>

      <button
        type="button"
        className="pointer-events-auto absolute right-3 top-3 hidden h-11 w-11 items-center justify-center rounded-md bg-surface/90 text-muted shadow-border sm:right-5 sm:top-5 sm:inline-flex"
        aria-label={full ? "Salir de pantalla completa" : "Pantalla completa"}
        onClick={() => {
          if (!document.fullscreenElement) {
            void document.documentElement.requestFullscreen().catch(() => undefined);
          } else {
            void document.exitFullscreen().catch(() => undefined);
          }
        }}
      >
        {full ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
      </button>

      <div className="absolute left-3 right-3 top-24 z-20 max-md:bottom-36 max-md:top-auto md:left-5 md:right-auto md:top-28">
        <InfoPanel />
      </div>

      <div className="absolute inset-x-3 bottom-3 z-20 flex flex-col items-stretch gap-2 sm:inset-x-5">
        <nav
          className="planet-nav pointer-events-auto overflow-x-auto"
          aria-label="Planetas"
        >
          <div className="flex w-max min-w-full flex-nowrap justify-center gap-1.5">
          {FOCUSABLE.map((id) => {
            const body = BODIES.find((b) => b.id === id)!;
            const active = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => useSim.getState().select(active ? null : id)}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium shadow-border transition-colors duration-[var(--motion-quick)] sm:h-11 sm:px-3 sm:text-sm",
                  active ? "bg-accent text-accent-fg" : "bg-surface/90 text-muted hover:text-fg",
                )}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: body.color }}
                  aria-hidden
                />
                {body.name}
              </button>
            );
          })}
          </div>
        </nav>

        <div className="pointer-events-auto flex w-full flex-col gap-2 rounded-lg bg-surface/90 p-2.5 shadow-border sm:flex-row sm:items-center sm:gap-3 sm:px-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => useSim.getState().togglePause()}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-md bg-accent px-3 text-accent-fg"
              aria-label={paused ? "Reanudar" : "Pausar"}
            >
              {paused ? (
                <Play className="size-4 ml-0.5" strokeWidth={1.75} />
              ) : (
                <Pause className="size-4" strokeWidth={1.75} />
              )}
              <span className="ml-2 hidden sm:inline">{paused ? "Reanudar" : "Pausar"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                clock.years = 0;
                useSim.setState({ years: 0, selected: null });
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-raised text-muted shadow-border hover:text-fg"
              aria-label="Reiniciar tiempo"
              title="Reiniciar tiempo"
            >
              <RotateCcw className="size-4" strokeWidth={1.75} />
            </button>
          </div>

          <label className="flex min-w-0 flex-1 flex-col gap-1 sm:px-1">
            <span className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-subtle">
              Velocidad
              <span className="tabular-nums text-fg">{formatSpeed(speed)}</span>
            </span>
            <input
              type="range"
              min={SPEED_MIN}
              max={SPEED_MAX}
              step={0.05}
              value={slider}
              onChange={(e) => useSim.getState().setSpeed(speedFromSlider(Number(e.target.value)))}
              className="solar-slider"
              aria-label="Velocidad de simulación"
            />
          </label>

          <div className="flex gap-1.5">
            <Toggle
              pressed={showOrbits}
              onPressed={() => useSim.getState().toggleOrbits()}
              label="Órbitas"
              icon={Orbit}
            />
            <Toggle
              pressed={showTrails}
              onPressed={() => useSim.getState().toggleTrails()}
              label="Estelas"
              icon={Spline}
            />
            <Toggle
              pressed={showLabels}
              onPressed={() => useSim.getState().toggleLabels()}
              label="Nombres"
              icon={showLabels ? Eye : EyeOff}
            />
          </div>
        </div>
        <p className="hidden px-1 text-center font-mono text-xs text-subtle md:block">
          Espacio pausa · Esc vista general · +/− velocidad
        </p>
      </div>
    </div>
  );
}
