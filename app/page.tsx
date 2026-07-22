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
            Explorá tu identidad, tus patrones y cómo conectás con el mundo a través de países, marcas y sistemas de autoconocimiento.
          </p>
          <p className="mx-auto mt-2 text-sm text-muted">Sin registro. Sin costo. Solo tu nombre y fecha de nacimiento.</p>
        </section>

        <section className="mx-auto max-w-xl mb-10 sm:mb-14">
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
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-6 text-center">¿Qué podés descubrir?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🧭",
                title: "Identidad",
                subtitle: "¿Quién soy?",
                description: "Descubrí los números y arquetipos que definen tu esencia. Tu mapa empieza aquí.",
                highlight: false,
              },
              {
                icon: "🔄",
                title: "Patrones",
                subtitle: "¿Qué se repite en mí?",
                description: "Reconocé las tendencias que guían tus decisiones, relaciones y forma de vivir.",
                highlight: false,
              },
              {
                icon: "🔢",
                title: "Numerología",
                subtitle: "¿Qué dicen los números?",
                description: "A partir de tu nombre y fecha de nacimiento, Molino calcula tu Life Path, Expression y otros números clave que revelan tu propósito y potencial.",
                highlight: false,
              },
              {
                icon: "✨",
                title: "Astrología",
                subtitle: "¿Qué dicen los astros?",
                description: "Explorá tu signo solar, tu elemento y cómo los ciclos planetarios influyen en tu identidad y en los momentos clave de tu vida.",
                highlight: false,
              },
              {
                icon: "🌍",
                title: "Países",
                subtitle: "¿Dónde resonás?",
                description: "Descubrí qué países resuenan con tu mapa personal. Molino analiza cómo tu identidad se alinea con la energía y cultura de diferentes lugares del mundo.",
                highlight: true,
                extra: "Basado en tu Life Path, signo zodiacal, elemento y patrones de personalidad.",
              },
              {
                icon: "🏷️",
                title: "Marcas",
                subtitle: "¿Qué marcas te representan?",
                description: "Conocé las marcas que vibran con tu identidad. Molino conecta tu mapa personal con marcas que reflejan tu esencia, desde moda hasta tecnología.",
                highlight: true,
                extra: "Basado en tu arquetipo, números clave y patrones de comportamiento.",
              },
              {
                icon: "🌊",
                title: "Ciclos",
                subtitle: "¿Cómo cambia mi experiencia?",
                description: "Entendé las etapas que atraviesas en el tiempo: cómo evoluciona tu energía, tus decisiones y tus relaciones a lo largo del año.",
                highlight: false,
              },
              {
                icon: "⏳",
                title: "Momento",
                subtitle: "¿Dónde estoy ahora?",
                description: "Descubrí tu Año, Mes y Día Personal para entender el momento exacto que estás viviendo y tomar decisiones más alineadas.",
                highlight: false,
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-6 bg-background ${
                  item.highlight ? "border-accent/40" : "border-border"
                }`}
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-medium text-foreground mt-3">{item.title}</h3>
                <p className="text-xs text-accent mt-1">{item.subtitle}</p>
                <p className="text-sm text-muted mt-2 leading-relaxed">{item.description}</p>
                {item.extra && <p className="text-xs text-muted mt-3 leading-relaxed">{item.extra}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <UniversityFooter />
    </div>
  );
}
