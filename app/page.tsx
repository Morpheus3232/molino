"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { saveSession } from "@/lib/storage/ephemeral";
import { saveProfileToStorage } from "@/lib/storage/localStorage";
import Button from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(String(new Date().getFullYear() - 25));
  const [error, setError] = useState("");
  const [checkingProfile, setCheckingProfile] = useState(true);

  const daysInMonth = (() => {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (!m || !y) return 31;
    return new Date(y, m, 0).getDate();
  })();

  const yearOptions = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const stored = localStorage.getItem("molino-profile");
    if (stored) {
      router.replace("/profile");
    } else {
      setCheckingProfile(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedDay = parseInt(day, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (!name.trim() || !parsedDay || !parsedMonth || !parsedYear) {
      setError("Completá tu nombre y fecha de nacimiento.");
      return;
    }

    try {
      const birthDate = `${parsedYear}-${String(parsedMonth).padStart(2, "0")}-${String(parsedDay).padStart(2, "0")}`;
      const calculated = calculateUserProfile(name.trim(), birthDate);
      const profile: UserProfile = {
        ...calculated,
        birthPlace: "",
        birthTime: undefined,
        goal: "life",
        interests: [],
        onboardingStep: 1,
        completedSections: ["identity"],
        theme: "light",
        language: "es",
        notifications: true,
      };

      saveSession({
        name: profile.name,
        birthDate: profile.birthDate,
        birthPlace: profile.birthPlace,
        birthTime: profile.birthTime,
        goal: profile.goal,
        interests: profile.interests,
        onboardingStep: profile.onboardingStep,
        completedSections: profile.completedSections,
        theme: profile.theme,
        language: profile.language,
        notifications: profile.notifications,
      });
      saveProfileToStorage(profile);
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Hubo un error generando tu perfil. Intentá de nuevo.");
    }
  };

  if (checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-content px-4 sm:px-6 py-10 sm:py-14">
        <section className="text-center mb-10 sm:mb-14">
          <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Descubrí el mapa que te hace único.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
            Tu mapa personal de autoconocimiento. Explorá tu identidad, tus patrones y tus ciclos a partir de tus propios datos.
          </p>
          <p className="mx-auto mt-2 text-sm text-muted">Sin registro. Sin costo. Solo tu nombre y fecha de nacimiento.</p>
        </section>

        <section className="mx-auto max-w-xl mb-10 sm:mb-14">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Creá tu mapa</p>
            <p className="text-sm text-muted">Empezá con tu nombre y fecha de nacimiento. Molino construye una primera lectura de tu mapa personal.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Tu nombre</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Ej: María"
                required
                minLength={2}
                maxLength={40}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Fecha de nacimiento</label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="input"
                  required
                  aria-label="Día"
                >
                  <option value="">Día</option>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={String(d)}>{d}</option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="input"
                  required
                  aria-label="Mes"
                >
                  {[
                    { value: "01", label: "Ene" },
                    { value: "02", label: "Feb" },
                    { value: "03", label: "Mar" },
                    { value: "04", label: "Abr" },
                    { value: "05", label: "May" },
                    { value: "06", label: "Jun" },
                    { value: "07", label: "Jul" },
                    { value: "08", label: "Ago" },
                    { value: "09", label: "Sep" },
                    { value: "10", label: "Oct" },
                    { value: "11", label: "Nov" },
                    { value: "12", label: "Dic" },
                  ].map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="input"
                  required
                  aria-label="Año"
                >
                  <option value="">Año</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <Button type="submit" fullWidth size="lg">
              Descubrir mi mapa →
            </Button>
          </form>
        </section>

        <section className="mb-10 sm:mb-14">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-6 text-center">TU MAPA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🧭", title: "Identidad", subtitle: "Quién sos", description: "Los números y arquetipos que definen tu esencia." },
              { icon: "🔄", title: "Patrones", subtitle: "Qué se repite", description: "Tendencias que guían tus decisiones y relaciones." },
              { icon: "🌍", title: "Países", subtitle: "Dónde resonás", description: "Lugares que alinean con tu identidad y ciclos." },
              { icon: "🏷️", title: "Marcas", subtitle: "Qué te representa", description: "Marcas que vibran con tu mapa personal." },
              { icon: "🔢", title: "Numerología", subtitle: "Qué dicen los números", description: "Life Path, Expression y otros números clave." },
              { icon: "✨", title: "Astrología", subtitle: "Qué dicen los astros", description: "Signo solar, elemento y ciclos disponibles." },
              { icon: "🌊", title: "Ciclos", subtitle: "Cómo cambia", description: "Las etapas que atraviesas en el tiempo." },
              { icon: "⏳", title: "Momento", subtitle: "Dónde estás", description: "Año, mes y día personal para este momento." },
            ].map((item) => (
              <div key={item.title} className="border-b border-border pb-4">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-sm font-medium text-foreground mt-2">{item.title}</h3>
                <p className="text-xs text-accent mt-1">{item.subtitle}</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 sm:mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div>
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-3">Cómo funciona</h2>
              <ol className="list-decimal list-inside text-sm text-muted space-y-2">
                <li>Introducís tu nombre y fecha de nacimiento.</li>
                <li>Molino construye tu mapa personal.</li>
                <li>Explorás tu identidad, tus números y tus ciclos.</li>
              </ol>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-3">Principios</h2>
              <ul className="list-disc list-inside text-sm text-muted space-y-2">
                <li>Gratis y sin registro.</li>
                <li>Código abierto.</li>
                <li>Herramienta de autoconocimiento, no predicción.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10 sm:mb-14">
          <p className="text-xs text-muted max-w-3xl mx-auto">
            Molino es una herramienta de autoconocimiento y entretenimiento. Sus interpretaciones no constituyen predicciones absolutas, asesoramiento profesional ni determinan el futuro.
          </p>
        </section>
      </main>

      <UniversityFooter />
    </div>
  );
}
