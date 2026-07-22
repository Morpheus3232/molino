"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { saveSession } from "@/lib/storage/ephemeral";
import { saveProfileToStorage } from "@/lib/storage/localStorage";

const DEMO_PROFILE = {
  name: "Martín",
  birthDate: "12/04/1992",
  lifePath: 7,
  sunSign: "Aries",
  element: "Fuego",
  modality: "Cardinal",
  chineseZodiac: "Mono",
  chineseElement: "Metal",
  archetype: "El Investigador",
  personalYear: 3,
  personalMonth: 5,
  personalDay: 9,
};

const MAP_LAYERS = [
  { id: "identity", title: "Identidad", subtitle: "Quién sos", color: "#C49A2A" },
  { id: "patterns", title: "Patrones", subtitle: "Qué se repite", color: "#8B7355" },
  { id: "numerology", title: "Numerología", subtitle: "Qué dicen los números", color: "#2E5C8A" },
  { id: "astrology", title: "Astrología", subtitle: "Qué dicen los astros", color: "#6B4C7A" },
  { id: "cycles", title: "Ciclos", subtitle: "Cómo cambia", color: "#2D5A3D" },
  { id: "moment", title: "Momento", subtitle: "Dónde estás", color: "#C44536" },
];

const EXPLORE_LAYERS = [
  { title: "Lugares", subtitle: "Dónde resonás", available: false },
  { title: "Marcas", subtitle: "Qué te representa", available: false },
  { title: "Relaciones", subtitle: "Cómo conectás", available: false },
];

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(String(new Date().getFullYear() - 25));
  const [error, setError] = useState("");
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysInMonth = (() => {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (!m || !y) return 31;
    return new Date(y, m, 0).getDate();
  })();

  const yearOptions = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const stored = localStorage.getItem("molino.user-profile.v1");
    if (stored) {
      router.replace("/profile");
    } else {
      setCheckingProfile(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const parsedDay = parseInt(day, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (!name.trim() || !parsedDay || !parsedMonth || !parsedYear) {
      setError("Completá tu nombre y fecha de nacimiento.");
      setIsSubmitting(false);
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
      setIsSubmitting(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted" role="status" aria-label="Cargando">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <svg width="28" height="28" viewBox="0 0 64 64" className="shrink-0" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
              <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
            </svg>
            <span className="font-serif font-bold text-xl text-foreground tracking-tight">Molino</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
          <div className="mx-auto max-w-content px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center relative">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-medium mb-6 animate-fade-in">
              Tu mapa personal de autoconocimiento
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.1] animate-fade-in-up">
              Descubrí el mapa
              <br />
              <span className="text-accent">que te hace único.</span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-muted leading-relaxed animate-fade-in-up stagger-1">
              Molino construye tu mapa personal a partir de tu nombre y fecha de nacimiento. Una misma base simbólica para explorar identidad, patrones, numerología, astrología y ciclos.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-muted animate-fade-in-up stagger-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent" aria-hidden="true" />
                Gratis
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent" aria-hidden="true" />
                Sin registro
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent" aria-hidden="true" />
                Sin rastreo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent" aria-hidden="true" />
                Código abierto
              </span>
            </div>
          </div>
        </section>

        {/* FORMULARIO */}
        <section className="mx-auto max-w-xl px-4 sm:px-6 mb-20 sm:mb-28" aria-label="Crear tu mapa">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Comenzá a construir tu mapa</p>
            <p className="text-sm text-muted">Ingresá tu nombre y fecha de nacimiento. Molino construye una primera lectura de tu mapa personal.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">
                Tu nombre
              </label>
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
                autoComplete="name"
                aria-describedby={error ? "form-error" : undefined}
                aria-invalid={!!error}
              />
            </div>
            <div>
              <fieldset>
                <legend className="block text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">
                  Fecha de nacimiento
                </legend>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="birth-day" className="sr-only">Día</label>
                    <select
                      id="birth-day"
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
                  </div>
                  <div>
                    <label htmlFor="birth-month" className="sr-only">Mes</label>
                    <select
                      id="birth-month"
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
                  </div>
                  <div>
                    <label htmlFor="birth-year" className="sr-only">Año</label>
                    <select
                      id="birth-year"
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
              </fieldset>
            </div>
            {error && (
              <p id="form-error" className="text-sm text-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-8 py-4 text-base bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Construyendo tu mapa...
                </>
              ) : (
                <>Descubrir mi mapa</>
              )}
            </button>
          </form>
        </section>

        {/* CAPAS DEL MAPA */}
        <section className="mx-auto max-w-content px-4 sm:px-6 mb-20 sm:mb-28" aria-label="Capas del mapa">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">Un mapa. Muchas capas.</p>
            <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
              Tu mapa personal se construye desde una misma base simbólica. Las dimensiones no son herramientas separadas: son capas de un mismo territorio.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Central node */}
              <div className="flex justify-center mb-8">
                <div className="relative px-6 py-3 border border-accent/30 rounded-full bg-accent-alpha-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Tu Mapa</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="hidden sm:block absolute left-1/2 top-12 bottom-0 w-px bg-border -translate-x-1/2" aria-hidden="true" />

              {/* Layer grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MAP_LAYERS.map((layer, i) => (
                  <div
                    key={layer.id}
                    className={`map-node animate-fade-in-up stagger-${i + 1}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: layer.color }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{layer.title}</p>
                        <p className="text-xs text-muted mt-0.5">{layer.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exploration layers */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {EXPLORE_LAYERS.map((layer) => (
                  <div key={layer.title} className="map-node border-dashed opacity-60">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-border" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{layer.title}</p>
                        <p className="text-xs text-muted mt-0.5">{layer.subtitle}</p>
                        <p className="text-[10px] text-muted mt-1.5 uppercase tracking-wider">Próximamente</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PREGUNTAS CLAVE */}
        <section className="mx-auto max-w-content px-4 sm:px-6 mb-20 sm:mb-28" aria-label="Qué podés descubrir">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">¿Qué podés descubrir?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { question: "¿Quién soy?", answer: "Explorá tu identidad y los elementos que forman tu mapa personal." },
              { question: "¿Qué se repite?", answer: "Descubrí patrones y tendencias que aparecen en tu perfil." },
              { question: "¿En qué momento estoy?", answer: "Explorá tus ciclos y el momento actual de tu mapa." },
              { question: "¿Qué puedo explorar?", answer: "Conectá tu mapa con lugares, marcas y futuras dimensiones." },
            ].map((item) => (
              <div key={item.question} className="border border-border rounded-2xl p-6 hover:border-accent transition-colors">
                <p className="text-sm font-medium text-accent mb-2">{item.question}</p>
                <p className="text-sm text-muted leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EJEMPLO DEMO */}
        <section className="mx-auto max-w-content px-4 sm:px-6 mb-20 sm:mb-28" aria-label="Ejemplo de mapa">
          <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Así se ve un mapa</p>
              <p className="text-sm text-muted mt-1">Una primera lectura compacta a partir de tus datos.</p>
            </div>
            <span className="hidden sm:inline text-[10px] text-muted border border-border rounded-full px-3 py-1">EJEMPLO</span>
          </div>
          <div className="border border-border rounded-2xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-background/50 p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Perfil</p>
                  <p className="text-sm text-foreground font-medium mt-1">{DEMO_PROFILE.name} · {DEMO_PROFILE.birthDate}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Estado</p>
                  <p className="text-xs sm:text-sm text-foreground font-medium mt-1">Mapa generado</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                {[
                  { label: "Life Path", value: String(DEMO_PROFILE.lifePath) },
                  { label: "Signo solar", value: DEMO_PROFILE.sunSign },
                  { label: "Elemento", value: DEMO_PROFILE.element },
                  { label: "Arquetipo", value: DEMO_PROFILE.archetype },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-background p-3 sm:p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">{item.label}</p>
                    <p className="text-lg sm:text-xl font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: "Año personal", value: String(DEMO_PROFILE.personalYear) },
                  { label: "Mes personal", value: String(DEMO_PROFILE.personalMonth) },
                  { label: "Día personal", value: String(DEMO_PROFILE.personalDay) },
                  { label: "Zodiaco chino", value: `${DEMO_PROFILE.chineseZodiac} · ${DEMO_PROFILE.chineseElement}` },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-background p-3 sm:p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">{item.label}</p>
                    <p className="text-lg sm:text-xl font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section className="mx-auto max-w-content px-4 sm:px-6 mb-20 sm:mb-28" aria-label="Cómo funciona">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Creá", description: "Ingresá tu nombre y fecha de nacimiento." },
              { step: "02", title: "Descubrí", description: "Molino transforma tus datos en diferentes capas de información." },
              { step: "03", title: "Conectá", description: "Explorá cómo esas capas forman parte de un mismo mapa personal." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">{item.step} · {item.title}</p>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONOCIMIENTO */}
        <section className="mx-auto max-w-content px-4 sm:px-6 mb-20 sm:mb-28" aria-label="Explorá el conocimiento">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Explorá el conocimiento</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { title: "Numerología", description: "Life Path, Expression, Alma y números maestros." },
              { title: "Astrología", description: "Signos, elementos, modalidades y ciclos." },
              { title: "Ciclos", description: "Año personal, mes personal y día personal." },
              { title: "Arquetipos", description: "Los 9 arquetipos y los números maestros." },
              { title: "Autoconocimiento", description: "Identidad, patrones y momento actual." },
              { title: "Mapa personal", description: "Tu lectura integrada de todas las capas." },
            ].map((item) => (
              <div key={item.title} className="border border-border rounded-2xl p-4 hover:border-accent transition-colors">
                <p className="text-xs uppercase tracking-[0.18em] text-accent font-medium mb-2">{item.title}</p>
                <p className="text-xs text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* UNIVERSIDAD */}
        <section className="mx-auto max-w-content px-4 sm:px-6 mb-10 sm:mb-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-accent font-medium mb-3">Universidad Pública de Libre Acceso</p>
            <p className="text-sm text-muted leading-relaxed">
              El conocimiento simbólico como patrimonio abierto. Molino es gratuito, transparente, sin registro y sin rastreo. Código abierto para quien quiera revisar, aprender o colaborar.
            </p>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="mx-auto max-w-content px-4 sm:px-6 mb-10 sm:mb-14">
          <p className="text-xs text-muted max-w-3xl mx-auto text-center">
            Molino es una herramienta de autoconocimiento y entretenimiento. Sus interpretaciones no constituyen predicciones absolutas, asesoramiento profesional ni determinan el futuro.
          </p>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
                  <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
                  <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
                </svg>
                <span className="font-serif font-bold text-lg text-foreground tracking-tight">Molino</span>
              </div>
              <p className="text-sm text-muted mt-2">Tu mapa personal de autoconocimiento.</p>
              <p className="text-xs text-muted mt-1">Gratis · Sin registro · Código abierto</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Principios</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>Conocimiento libre</li>
                <li>Privacidad radical</li>
                <li>Transparencia total</li>
                <li>Código abierto</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Enlaces</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a></li>
                <li><a href="/conocimiento" className="hover:text-accent transition-colors">Documentación</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-border text-center text-xs text-muted">
            <p>Molino — Universidad Pública de Libre Acceso. Todo el contenido es educativo y no constituye asesoramiento profesional.</p>
            <p className="mt-1">El conocimiento simbólico es patrimonio de la humanidad. Compartilo libremente.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
