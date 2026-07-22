"use client";

import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <div className="mx-auto max-w-content px-4 sm:px-6 pt-16 pb-24 sm:pt-24">
        <section className="text-center sm:mb-24">
          <span className="badge mb-5">Personal Intelligence</span>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-serif tracking-tight md:text-5xl lg:text-6xl">
            Descubre tu mapa personal
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted">
            Molino combina numerología, astrología y sistemas de autoconocimiento para ayudarte a comprender tu identidad, tus ciclos y tus patrones.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => router.push("/onboarding")}>
              Crear mi perfil
            </Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById("que-es")?.scrollIntoView({ behavior: "smooth" })}>
              Explorar Molino
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

        <section id="que-es" className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge mb-3">Qué es Molino</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3 mb-4">Tu plataforma de autoconocimiento</h2>
            <p className="text-base text-muted leading-relaxed">
              Molino transforma tus datos personales en una experiencia personalizada y navegable. A partir de tu nombre y fecha de nacimiento, podés explorar tu identidad, tus números, tu carta astral, tus ciclos y recomendaciones para el crecimiento personal.
            </p>
          </div>
        </section>

        <section className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <span className="badge mb-3">Tu perfil personal</span>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3">Todo lo que podés descubrir</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🧭", title: "Identidad", desc: "Comprende los patrones que forman tu personalidad y tu manera de interactuar con el mundo." },
                { icon: "🔢", title: "Numerología", desc: "Explora los números derivados de tu nombre y fecha de nacimiento." },
                { icon: "⭐", title: "Astrología", desc: "Conoce los principales elementos de tu carta y cómo se relacionan entre sí." },
                { icon: "🌀", title: "Ciclos", desc: "Observa tus ciclos personales y los períodos que estás atravesando." },
                { icon: "💪", title: "Fortalezas", desc: "Descubre tus recursos naturales y áreas donde puedes desarrollarte." },
                { icon: "💞", title: "Relaciones", desc: "Explora compatibilidad y dinámicas entre diferentes perfiles." },
              ].map((item) => (
                <Card key={item.title} hover={false} padding="lg">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="font-medium text-foreground mt-3">{item.title}</h3>
                  <p className="text-sm text-muted mt-1">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="badge mb-3">Cómo funciona</span>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3">Tres pasos para tu mapa personal</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Creá tu perfil", desc: "Introduce tus datos básicos para comenzar." },
                { step: "2", title: "Descubrí tu mapa", desc: "Molino organiza y calcula tu información personal." },
                { step: "3", title: "Explorá tu identidad", desc: "Navegá por tus números, astrología, ciclos y recomendaciones." },
              ].map((item) => (
                <Card key={item.step} hover={false} padding="lg" className="text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-semibold mb-3">{item.step}</span>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted mt-1">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge mb-3">Para qué puedes usar Molino</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3 mb-4">Motivos para explorar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                "Quiero conocerme mejor.",
                "Quiero entender mis fortalezas.",
                "Quiero explorar mis ciclos.",
                "Quiero reflexionar sobre mis relaciones.",
                "Quiero descubrir nuevos patrones sobre mí.",
                "Quiero usar mis datos como punto de partida para el autoconocimiento.",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="mt-1 text-accent">•</span>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge mb-3">Tu mapa personal</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3 mb-4">Un sistema conectado</h2>
            <p className="text-base text-muted leading-relaxed">
              Identidad → Numerología → Astrología → Ciclos → Personalidad → Relaciones → Recomendaciones. Molino integra estas áreas en una experiencia coherente, no como herramientas aisladas.
            </p>
          </div>
        </section>

        <section className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">Comenzá ahora</h2>
            <p className="text-base text-muted mb-6">Creá tu perfil y descubrí tu mapa personal en minutos.</p>
            <Button size="lg" onClick={() => router.push("/onboarding")}>
              Crear mi perfil →
            </Button>
          </div>
        </section>

        <section className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-3xl text-center text-xs text-muted">
            <p>
              Molino es una herramienta de autoconocimiento y entretenimiento. Sus interpretaciones no constituyen predicciones absolutas, asesoramiento profesional ni determinan el futuro.
            </p>
          </div>
        </section>
      </div>

      <UniversityFooter />
    </div>
  );
}
