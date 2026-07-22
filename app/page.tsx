"use client";

import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <div className="mx-auto max-w-content px-4 sm:px-6 pt-16 pb-24 sm:pt-24">
        <section className="text-center sm:mb-24">
          <span className="badge mb-5">Personal Intelligence</span>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-serif tracking-tight md:text-5xl lg:text-6xl">
            Entendé tus patrones para tomar mejores decisiones
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg">
            Un sistema simbólico que explora patrones de personalidad, ciclos y significado.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => router.push("/onboarding")}>
              Descubrí tu perfil →
            </Button>
          </div>
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
            <span>🔓 Código abierto</span>
            <span className="text-border" aria-hidden="true">•</span>
            <span>💯 100% gratuito</span>
            <span className="text-border" aria-hidden="true">•</span>
            <span>🕊️ Sin registro</span>
          </div>
        </section>
      </div>

      <UniversityFooter />
    </div>
  );
}
