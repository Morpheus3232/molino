"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/storage/ephemeral";
import { loadProfileFromStorage, clearStoredProfile } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";

function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: "♈",
  Tauro: "♉",
  Géminis: "♊",
  Cáncer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Escorpio: "♏",
  Sagitario: "♐",
  Capricornio: "♑",
  Acuario: "♒",
  Piscis: "♓",
};

const ELEMENT_COLORS: Record<string, string> = {
  Fuego: "#C49A2A",
  Tierra: "#2D5A3D",
  Aire: "#6B4C7A",
  Agua: "#2E5C8A",
  Metal: "#7A8A99",
  Madera: "#8FBC8F",
};

const SECTIONS = [
  { id: "identity", label: "Identidad" },
  { id: "patterns", label: "Patrones" },
  { id: "moment", label: "Mi Momento" },
  { id: "numbers", label: "Numerología" },
  { id: "astrology", label: "Astrología" },
] as const;

const ARCHETYPE_DESCRIPTIONS: Record<number, string> = {
  1: "Naciste para liderar con independencia y claridad. Tu camino se construye con iniciativa, originalidad y coraje.",
  2: "Tu energía es la del puente. Desarrollás la sensibilidad, la diplomacia y la capacidad de unir mundos diferentes.",
  3: "Tu energía es la expresión creativa. Desarrollás la comunicación, la alegría y la capacidad de inspirar a otros.",
  4: "Tu energía es la de los cimientos. Desarrollás la confiabilidad, la organización y la capacidad de construir cosas duraderas.",
  5: "Tu energía es la del cambio. Desarrollás la curiosidad, la adaptabilidad y la capacidad de expandir horizontes.",
  6: "Tu energía es la del hogar y la responsabilidad. Desarrollás la protección, la armonía y el amor práctico.",
  7: "Tu energía es la verdad interna. Desarrollás la sabiduría, la observación y la capacidad de ir más allá de lo superficial.",
  8: "Tu energía es la del imperio. Desarrollás la estrategia, la visión y la capacidad de materializar proyectos grandes.",
  9: "Tu energía es la del todo. Desarrollás la adaptación, la compasión y la capacidad de cerrar ciclos con sabiduría.",
  11: "Tu energía es la del puente entre mundos. Desarrollás la intuición, la inspiración y la capacidad de transmitir ideas nuevas.",
  22: "Tu energía es la del arquitecto divino. Desarrollás la manifestación, la organización y la capacidad de construir a gran escala.",
  33: "Tu energía es la del amor universal en acción. Desarrollás la sanación, la compasión y la capacidad de transformar desde el corazón.",
};

function MapNode({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-xl p-5 transition-all hover:border-accent hover:shadow-md ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-5 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </h2>
  );
}

function StatCard({ label, value, subtitle, color }: { label: string; value: string | number; subtitle?: string; color?: string }) {
  return (
    <MapNode>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">{label}</p>
      <p className="text-3xl sm:text-4xl font-semibold" style={{ color: color || "var(--color-foreground)" }}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-muted mt-1.5">{subtitle}</p>}
    </MapNode>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("identity");

  useEffect(() => {
    setMounted(true);
    try {
      const stored = loadProfileFromStorage();
      if (stored) {
        setProfile(stored as UserProfile);
      } else {
        const existing = getSession();
        if (existing?.name && existing?.birthDate) {
          const calculated = calculateUserProfile(existing.name, existing.birthDate);
          setProfile({
            ...calculated,
            birthPlace: existing.birthPlace,
            birthTime: existing.birthTime,
            goal: (existing.goal as UserProfile["goal"]) || "life",
            interests: existing.interests,
            onboardingStep: existing.onboardingStep,
            completedSections: existing.completedSections,
            theme: existing.theme,
            language: existing.language,
            notifications: existing.notifications,
          });
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.error(err);
      router.push("/");
    }
  }, [router]);

  const handleNewSession = () => {
    clearSession();
    clearStoredProfile();
    router.push("/");
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted" role="status" aria-label="Cargando tu perfil">Cargando tu perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
                <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
                <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
              </svg>
              <span className="font-serif font-bold text-xl text-foreground tracking-tight">Molino</span>
            </a>
          </div>
        </header>
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-accent font-medium mb-2">Mi mapa personal</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">Todavía no creaste tu mapa</h1>
          <p className="text-muted mb-8">Ingresá tu nombre y fecha de nacimiento para generar tu perfil.</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-8 py-4 text-base bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            Descubrir mi Mapa
          </button>
        </div>
      </div>
    );
  }

  const lifePath = safeNumber(profile.lifePath, 1);
  const expressionNumber = safeNumber(profile.expressionNumber, 0);
  const soulNumber = safeNumber(profile.soulNumber, 0);
  const personalityNumber = safeNumber(profile.personalityNumber, 0);
  const name = typeof profile.name === "string" ? profile.name : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const sunSignSymbol = ZODIAC_SYMBOLS[sunSign] || "♈";
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const archetypeDescription = typeof profile.archetypeInfo?.description === "string" ? profile.archetypeInfo.description : ARCHETYPE_DESCRIPTIONS[lifePath] || "";
  const archetypeStrengths = Array.isArray(profile.archetypeInfo?.strengths) ? profile.archetypeInfo.strengths : [];
  const archetypeChallenges = Array.isArray(profile.archetypeInfo?.challenges) ? profile.archetypeInfo.challenges : [];
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);
  const personalMonth = safeNumber(profile.cycles?.personalMonth, 0);
  const personalDay = safeNumber(profile.cycles?.personalDay, 0);
  const archetype = ARCHETYPES[lifePath];
  const elementColor = ELEMENT_COLORS[element] || "#C49A2A";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
              <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
            </svg>
            <span className="font-serif font-bold text-xl text-foreground tracking-tight">Molino</span>
          </a>
          <button
            onClick={handleNewSession}
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-2 text-sm bg-transparent text-secondary border border-border hover:border-accent hover:text-accent"
          >
            Nueva sesión
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-content px-4 sm:px-6 py-10 pb-24" id="main-content">
        {/* HERO */}
        <section className="mb-12 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-medium mb-3">Tu mapa personal</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">{name}</h1>
          <p className="text-base text-muted mt-3">{birthDate}</p>

          {archetype && (
            <div className="mt-6 p-5 rounded-2xl border border-border bg-card">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Tu arquetipo</p>
              <p className="font-serif text-xl sm:text-2xl font-semibold" style={{ color: elementColor }}>
                {archetype.name}
              </p>
              {archetype.quote && (
                <p className="text-sm text-muted mt-2 italic">"{archetype.quote}"</p>
              )}
            </div>
          )}
        </section>

        {/* NAV */}
        <nav className="mb-10 flex flex-wrap gap-2" aria-label="Secciones del mapa">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
                activeSection === section.id
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border text-muted hover:text-foreground hover:border-foreground/20"
              }`}
              aria-current={activeSection === section.id ? "true" : undefined}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* IDENTIDAD */}
        <section id="identity" className="scroll-mt-24 mb-12">
          <SectionLabel>Identidad</SectionLabel>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard label="Life Path" value={lifePath} subtitle="Tu dirección principal" color={elementColor} />
            <StatCard label="Expresión" value={expressionNumber || "—"} subtitle="Cómo te presentás" color={elementColor} />
            <StatCard label="Alma" value={soulNumber || "—"} subtitle="Lo que realmente deseás" color={elementColor} />
            <StatCard label="Personalidad" value={personalityNumber || "—"} subtitle="La imagen que proyectás" color={elementColor} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MapNode>
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Zodiaco</p>
              <p className="text-lg font-medium text-foreground">
                {sunSignSymbol} {sunSign}
              </p>
              <p className="text-sm text-muted mt-1">Elemento: {element} · Modalidad: {modality}</p>
            </MapNode>
            <MapNode>
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Arquetipo</p>
              <p className="text-lg font-medium text-foreground">{archetypeName}</p>
              <p className="text-sm text-muted mt-1">Zodiaco chino: {chineseZodiac} · {chineseElement}</p>
            </MapNode>
          </div>

          {/* Narrative */}
          <MapNode className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">Tu identidad en contexto</p>
            <p className="text-sm text-muted leading-relaxed">
              Tu nombre es <span className="text-foreground font-medium">{name}</span>. Naciste el <span className="text-foreground font-medium">{birthDate}</span>.
            </p>
            <p className="text-sm text-muted leading-relaxed mt-2">
              Eres un <span className="text-foreground font-medium">{archetypeName}</span>. {archetypeDescription}
            </p>
          </MapNode>
        </section>

        {/* PATRONES */}
        <section id="patterns" className="scroll-mt-24 mb-12">
          <SectionLabel>Patrones</SectionLabel>

          <MapNode>
            <div className="space-y-4">
              {archetypeStrengths.length > 0 && (
                <p className="text-sm text-muted leading-relaxed">
                  Un lado muy tuyo se ve en esto: <span className="text-foreground font-medium">{archetypeStrengths.slice(0, 2).join(" y ")}</span>. Son formas naturales en las que aparecés sin esfuerzo.
                </p>
              )}
              {archetypeChallenges.length > 0 && (
                <p className="text-sm text-muted leading-relaxed">
                  Al mismo tiempo, hay zonas que te piden más atención: <span className="text-foreground font-medium">{archetypeChallenges.slice(0, 2).join(" y ")}</span>. No son fallas, sino lugares donde podés elegir responder con más conciencia.
                </p>
              )}
              <p className="text-sm text-muted leading-relaxed">
                Reconocer estos patrones no es para etiquetarte, sino para tener más opciones. Cuando veas estas tendencias, podés decidir si querés seguir por el mismo camino o probar otra forma.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background">
                <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Fortalezas</p>
                <ul className="space-y-1.5">
                  {archetypeStrengths.map((item: string) => (
                    <li key={item} className="text-sm text-muted flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-background">
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Desafíos</p>
                <ul className="space-y-1.5">
                  {archetypeChallenges.map((item: string) => (
                    <li key={item} className="text-sm text-muted flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-border mt-1.5 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MapNode>
        </section>

        {/* MI MOMENTO */}
        <section id="moment" className="scroll-mt-24 mb-12">
          <SectionLabel>Mi Momento</SectionLabel>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Año personal", value: personalYear, desc: "El tema general de tu año" },
              { label: "Mes personal", value: personalMonth, desc: "La energía de este mes" },
              { label: "Día personal", value: personalDay, desc: "Tu energía hoy" },
            ].map((cycle) => (
              <MapNode key={cycle.label}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium">{cycle.label}</p>
                  <span className="text-2xl font-semibold" style={{ color: elementColor }}>{cycle.value || "—"}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(((cycle.value || 0) / 9) * 100, 100)}%`,
                      backgroundColor: elementColor,
                    }}
                  />
                </div>
                <p className="text-xs text-muted mt-2">{cycle.desc}</p>
              </MapNode>
            ))}
          </div>
        </section>

        {/* NUMEROLOGÍA */}
        <section id="numbers" className="scroll-mt-24 mb-12">
          <SectionLabel>Numerología</SectionLabel>

          <MapNode>
            <p className="text-sm text-muted mb-5">
              Tu Life Path es <span className="text-foreground font-medium">{lifePath}</span>. Este número resume la dirección principal de tu vida.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Expresión", value: expressionNumber, desc: "Cómo te presentás" },
                { label: "Alma", value: soulNumber, desc: "Lo que realmente deseás" },
                { label: "Personalidad", value: personalityNumber, desc: "La imagen que proyectás" },
              ].map((num) => (
                <div key={num.label} className="p-4 rounded-xl bg-background">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium">{num.label}</p>
                  <p className="text-2xl font-semibold mt-1" style={{ color: elementColor }}>{num.value || "—"}</p>
                  <p className="text-xs text-muted mt-1">{num.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                onClick={() => router.push("/numerologia")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-5 py-3 text-sm bg-transparent text-secondary border border-border hover:border-accent hover:text-accent"
              >
                Explorar numerología completa
              </button>
            </div>
          </MapNode>
        </section>

        {/* ASTROLOGÍA */}
        <section id="astrology" className="scroll-mt-24 mb-12">
          <SectionLabel>Astrología</SectionLabel>

          <MapNode>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background">
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Signo solar</p>
                <p className="text-lg font-medium text-foreground">{sunSignSymbol} {sunSign}</p>
                <p className="text-sm text-muted mt-1">Elemento: {element}</p>
              </div>
              <div className="p-4 rounded-xl bg-background">
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Zodiaco chino</p>
                <p className="text-lg font-medium text-foreground">{chineseZodiac}</p>
                <p className="text-sm text-muted mt-1">Elemento: {chineseElement}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => router.push("/astrologia")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-5 py-3 text-sm bg-transparent text-secondary border border-border hover:border-accent hover:text-accent"
              >
                Explorar astrología completa
              </button>
            </div>
          </MapNode>
        </section>
      </div>

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
                <li><a href="/biblioteca" className="hover:text-accent transition-colors">Documentación</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-border text-center text-xs text-muted">
            <p>Molino — Universidad Pública de Libre Acceso. Todo el contenido es educativo y no constituye asesoramiento profesional.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
