"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/storage/ephemeral";
import { loadProfileFromStorage, clearStoredProfile } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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
  Fuego: "#D4A843",
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
        <div className="text-muted">Cargando tu perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Mi mapa personal</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">Todavía no creaste tu mapa</h1>
          <p className="text-muted mb-8">Ingresá tu nombre y fecha de nacimiento para generar tu perfil.</p>
          <Button onClick={() => router.push("/")}>Descubrir mi Mapa</Button>
        </div>
        <UniversityFooter />
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

  const identityNarrative = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Tu nombre es ${name}. Naciste el ${birthDate}.`);
    lines.push(`Eres un ${archetypeName}. ${archetypeDescription}`);
    return lines;
  }, [name, birthDate, archetypeName, archetypeDescription]);

  const patternsNarrative = useMemo(() => {
    const paragraphs: string[] = [];
    if (archetypeStrengths.length > 0) {
      paragraphs.push(`Un lado muy tuyo se ve en esto: ${archetypeStrengths.slice(0, 2).join(" y ")}. Son formas naturales en las que aparecés sin esfuerzo.`);
    }
    if (archetypeChallenges.length > 0) {
      paragraphs.push(`Al mismo tiempo, hay zonas que te piden más atención: ${archetypeChallenges.slice(0, 2).join(" y ")}. No son fallas, sino lugares donde podés elegir responder con más conciencia.`);
    }
    paragraphs.push("Reconocer estos patrones no es para etiquetarte, sino para tener más opciones. Cuando veas estas tendencias, podés decidir si querés seguir por el mismo camino o probar otra forma.");
    return paragraphs;
  }, [archetypeStrengths, archetypeChallenges]);

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <div className="mx-auto max-w-content px-4 sm:px-6 py-10 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Mi mapa personal</p>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground">{name}</h1>
            <p className="text-base text-muted mt-2">{birthDate}</p>
          </div>
          <Button variant="secondary" onClick={handleNewSession}>Nueva sesión</Button>
        </div>

        <nav className="mb-10 flex flex-wrap gap-2" aria-label="Mapa personal">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                activeSection === section.id ? "bg-foreground text-background" : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <section id="identity" className="scroll-mt-24 mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Identidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card hover={false} padding="lg">
              <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Life Path</p>
              <p className="text-4xl font-semibold mt-2" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{lifePath}</p>
              <p className="text-sm text-muted mt-1">Tu dirección principal.</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Expresión</p>
              <p className="text-4xl font-semibold mt-2" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{expressionNumber || "—"}</p>
              <p className="text-sm text-muted mt-1">Cómo te presentás.</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Alma</p>
              <p className="text-4xl font-semibold mt-2" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{soulNumber || "—"}</p>
              <p className="text-sm text-muted mt-1">Lo que realmente deseás.</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Personalidad</p>
              <p className="text-4xl font-semibold mt-2" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{personalityNumber || "—"}</p>
              <p className="text-sm text-muted mt-1">La imagen que proyectás.</p>
            </Card>
          </div>

          <Card hover={false} padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Zodiaco</p>
                <p className="text-base text-foreground mt-1 font-medium">
                  {sunSignSymbol} {sunSign}
                </p>
                <p className="text-sm text-muted mt-1">Elemento: {element} · Modalidad: {modality}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Arquetipo</p>
                <p className="text-base text-foreground mt-1 font-medium">{archetypeName}</p>
                <p className="text-sm text-muted mt-1">Zodiaco chino: {chineseZodiac} · {chineseElement}</p>
              </div>
            </div>
          </Card>
        </section>

        <section id="patterns" className="scroll-mt-24 mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Patrones</h2>
          <Card hover={false} padding="lg">
            <div className="space-y-4">
              {patternsNarrative.map((paragraph, idx) => (
                <p key={idx} className="text-sm text-muted leading-relaxed">{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Fortalezas</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {archetypeStrengths.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Desafíos</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {archetypeChallenges.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </section>

        <section id="moment" className="scroll-mt-24 mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Mi Momento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card hover={false} padding="lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Año personal</p>
                <span className="text-2xl font-semibold" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{personalYear || "—"}</span>
              </div>
              <div className="w-full h-2 rounded-full border border-border bg-background">
                <div className="h-2 rounded-full bg-foreground" style={{ width: `${Math.min(((personalYear || 0) / 9) * 100, 100)}%` }} />
              </div>
            </Card>
            <Card hover={false} padding="lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Mes personal</p>
                <span className="text-2xl font-semibold" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{personalMonth || "—"}</span>
              </div>
              <div className="w-full h-2 rounded-full border border-border bg-background">
                <div className="h-2 rounded-full bg-foreground" style={{ width: `${Math.min(((personalMonth || 0) / 9) * 100, 100)}%` }} />
              </div>
            </Card>
            <Card hover={false} padding="lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Día personal</p>
                <span className="text-2xl font-semibold" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{personalDay || "—"}</span>
              </div>
              <div className="w-full h-2 rounded-full border border-border bg-background">
                <div className="h-2 rounded-full bg-foreground" style={{ width: `${Math.min(((personalDay || 0) / 9) * 100, 100)}%` }} />
              </div>
            </Card>
          </div>
        </section>

        <section id="numbers" className="scroll-mt-24 mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Numerología</h2>
          <Card hover={false} padding="lg">
            <p className="text-sm text-muted mb-4">Tu Life Path es {lifePath}. Este número resume la dirección principal de tu vida.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Expresión</p>
                <p className="text-2xl font-semibold mt-1" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{expressionNumber || "—"}</p>
                <p className="text-sm text-muted mt-1">Cómo te presentás.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Alma</p>
                <p className="text-2xl font-semibold mt-1" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{soulNumber || "—"}</p>
                <p className="text-sm text-muted mt-1">Lo que realmente deseás.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Personalidad</p>
                <p className="text-2xl font-semibold mt-1" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{personalityNumber || "—"}</p>
                <p className="text-sm text-muted mt-1">La imagen que proyectás.</p>
              </div>
            </div>
            <div className="mt-6">
              <Button fullWidth onClick={() => router.push("/numerologia")}>Explorar en Knowledge →</Button>
            </div>
          </Card>
        </section>

        <section id="astrology" className="scroll-mt-24 mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Astrología</h2>
          <Card hover={false} padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Signo solar</p>
                <p className="text-base text-foreground mt-1 font-medium">{sunSignSymbol} {sunSign}</p>
                <p className="text-sm text-muted mt-1">Elemento: {element}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Zodiaco chino</p>
                <p className="text-base text-foreground mt-1 font-medium">{chineseZodiac}</p>
                <p className="text-sm text-muted mt-1">Elemento: {chineseElement}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button fullWidth onClick={() => router.push("/astrologia")}>Explorar en Knowledge →</Button>
            </div>
          </Card>
        </section>
      </div>

      <UniversityFooter />
    </div>
  );
}
