import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hud } from "@/components/overlay/hud";

const SolarCanvas = lazy(() =>
  import("@/components/solar/solar-canvas").then((m) => ({ default: m.SolarCanvas })),
);

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <h1 className="sr-only">Órbita — explorador del sistema solar</h1>
      {mounted ? (
        <Suspense fallback={<LoadingMark />}>
          <SolarCanvas />
        </Suspense>
      ) : (
        <LoadingMark />
      )}
      <div className="solar-vignette pointer-events-none absolute inset-0 z-[1]" />
      <Hud />
    </main>
  );
}

function LoadingMark() {
  return (
    <div className="flex h-dvh items-center justify-center bg-bg">
      <p className="font-display text-xl tracking-tight text-fg">Cargando el sistema solar</p>
    </div>
  );
}
