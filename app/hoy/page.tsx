import HoyClient from "./HoyClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Hoy — Tu Energía y Foco Diario",
  description:
    "Descubrí tu vibración diaria, fase lunar, foco de acción y consejo del momento en Molino. 100% calculado en tu navegador.",
  path: "/hoy",
  ogTitle: "Tu Energía de Hoy",
  ogDescription: "Vibración diaria, vista de 3 días y foco de acción según tu numerología y astrología.",
});

export default function HoyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
        <header className="mb-8 sm:mb-10 max-w-2xl">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Tu energía de hoy
          </h1>
          <p className="text-sm sm:text-base text-muted mt-2 leading-relaxed">
            Vibración diaria, fase lunar y foco de acción calculados con numerología y astrología —
            100% en tu navegador. Si guardaste tu mapa, sumamos tu Año, Mes y Día Personal.
          </p>
        </header>
        <HoyClient />
      </main>
    </div>
  );
}
