"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { saveSession } from "@/lib/storage/ephemeral";
import { saveProfileToStorage } from "@/lib/storage/localStorage";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(String(new Date().getFullYear() - 25));
  const [error, setError] = useState("");

  const daysInMonth = (() => {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (!m || !y) return 31;
    return new Date(y, m, 0).getDate();
  })();

  const yearOptions = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

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

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <div className="mx-auto max-w-content px-4 sm:px-6">
        <section className="py-10 sm:py-14">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Descubrí el mapa que te hace único.
          </h1>
          <p className="mt-3 text-base text-muted max-w-2xl">
            Molino reúne numerología, astrología y herramientas de autoconocimiento para ayudarte a explorar tu identidad, reconocer tus patrones y entender los ciclos que estás atravesando.
          </p>
        </section>

        <section className="pb-10 sm:pb-14">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">¿Qué podés descubrir?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
            {[
              { title: "Identidad", desc: "Patrones que forman tu personalidad y tu manera de interactuar con el mundo." },
              { title: "Numerología", desc: "Números derivados de tu nombre y fecha de nacimiento." },
              { title: "Astrología", desc: "Elementos de tu carta y cómo se relacionan entre sí." },
              { title: "Patrones", desc: "Tendencias y características recurrentes en tu mapa." },
              { title: "Ciclos", desc: "El momento y los ciclos personales que estás atravesando." },
              { title: "Fortalezas", desc: "Tus recursos naturales y áreas de crecimiento." },
              { title: "Relaciones", desc: "Compatibilidad y dinámicas entre perfiles." },
              { title: "Recomendaciones", desc: "Sugerencias personalizadas basadas en tu mapa." },
            ].map((item) => (
              <div key={item.title} className="border-b border-border pb-3">
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="text-sm text-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-10 sm:pb-14">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Creá tu mapa personal</h2>
          <p className="text-base text-muted mb-6">Introducí tus datos para comenzar.</p>
          <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Nombre completo</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                placeholder="Tu nombre completo"
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
                  className="h-12 px-3 rounded-xl border border-border bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
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
                  className="h-12 px-3 rounded-xl border border-border bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
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
                  className="h-12 px-3 rounded-xl border border-border bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
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
            <button
              type="submit"
              className="w-full h-14 bg-foreground text-background rounded-xl font-medium transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
            >
              Descubrir mi Mapa
            </button>
          </form>
        </section>

        <section className="pb-10 sm:pb-14">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">¿Cómo funciona?</h2>
          <ol className="list-decimal list-inside text-sm text-muted space-y-2 max-w-2xl">
            <li>Introducís tu nombre y fecha de nacimiento.</li>
            <li>Molino construye tu mapa personal.</li>
            <li>Explorás tu identidad, tus números y tus ciclos.</li>
          </ol>
        </section>

        <section className="pb-10 sm:pb-14">
          <p className="text-xs text-muted max-w-3xl">
            Molino es una herramienta de autoconocimiento y entretenimiento. Sus interpretaciones no constituyen predicciones absolutas, asesoramiento profesional ni determinan el futuro.
          </p>
        </section>
      </div>

      <UniversityFooter />
    </div>
  );
}
