"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { loadProfileFromStorage } from "@/lib/storage/localStorage";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

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

export default function PatternsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadProfileFromStorage();
    if (stored) {
      setProfile(stored as UserProfile);
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground mb-4">Tus patrones en acción</h1>
          <p className="text-muted mb-8">Creá tu mapa personal para explorar tus patrones.</p>
          <Button onClick={() => router.push("/onboarding")}>Descubrir mi Mapa</Button>
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
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const sunSignSymbol = ZODIAC_SYMBOLS[sunSign] || "♈";
  const element = typeof profile.element === "string" ? profile.element : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);
  const personalMonth = safeNumber(profile.cycles?.personalMonth, 0);
  const personalDay = safeNumber(profile.cycles?.personalDay, 0);
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const archetypeDescription = typeof profile.archetypeInfo?.description === "string" ? profile.archetypeInfo.description : "";
  const archetypeStrengths = Array.isArray(profile.archetypeInfo?.strengths) ? profile.archetypeInfo.strengths : [];
  const archetypeChallenges = Array.isArray(profile.archetypeInfo?.challenges) ? profile.archetypeInfo.challenges : [];

  const radarData = useMemo(() => {
    const base = Math.min(lifePath * 10, 100);
    return [
      { subject: "Comunicación", value: Math.min((expressionNumber || lifePath) * 10, 100) },
      { subject: "Motivación", value: Math.min((soulNumber || lifePath) * 10, 100) },
      { subject: "Imagen", value: Math.min((personalityNumber || lifePath) * 10, 100) },
      { subject: "Estabilidad", value: base },
      { subject: "Intuición", value: 50 + (lifePath % 5) * 10 },
      { subject: "Acción", value: Math.min((lifePath + expressionNumber) * 8, 100) },
    ];
  }, [lifePath, expressionNumber, soulNumber, personalityNumber]);

  const patterns = useMemo(() => {
    const items: { title: string; description: string; advice: string }[] = [];

    if (lifePath && expressionNumber) {
      items.push({
        title: `Tu Life Path ${lifePath} con Expression ${expressionNumber}`,
        description: `Esta combinación sugiere que tu camino de vida está marcado por la energía del ${lifePath}, y la expresás principalmente a través de la comunicación y la creación.`,
        advice: "Aplicá esta energía escribiendo, enseñando o creando contenido.",
      });
    }

    if (soulNumber) {
      items.push({
        title: `Tu Alma busca ${soulNumber}`,
        description: `Tu número de alma revela que tus deseos más profundos se orientan hacia el ${soulNumber}. Esto influye en tus decisiones incluso cuando no lo notás.`,
        advice: "Revisá si tus decisiones actuales reflejan este deseo profundo.",
      });
    }

    if (personalityNumber) {
      items.push({
        title: `Tu personalidad proyecta ${personalityNumber}`,
        description: `Los demás suelen percibirte bajo la energía del ${personalityNumber}. Eso genera una primera impresión que puede abrir o cerrar puertas.`,
        advice: "Usá esa percepción a tu favor en entrevistas, reuniones o presentaciones.",
      });
    }

    if (archetypeStrengths.length > 0) {
      items.push({
        title: `Tu arquetipo: ${archetypeName}`,
        description: `Como ${archetypeName}, tus patrones más frecuentes se organizan alrededor de: ${archetypeStrengths.slice(0, 2).join(" y ")}. ${archetypeDescription}`,
        advice: "Reconocé cuándo estás operando desde estas fortalezas y cuándo estás en automático.",
      });
    }

    return items.slice(0, 4);
  }, [lifePath, expressionNumber, soulNumber, personalityNumber, archetypeName, archetypeDescription, archetypeStrengths]);

  const connections = useMemo(() => {
    const parts: string[] = [];

    if (element && lifePath) {
      parts.push(`Tu elemento ${element} y tu Life Path ${lifePath} crean una base donde la constancia y el significado se mezclan.`);
    }

    if (chineseZodiac && expressionNumber) {
      parts.push(`Tu signo chino ${chineseZodiac} suma un estilo de acción más ${chineseElement.toLowerCase()} a tu forma de expresarte.`);
    }

    if (sunSign && soulNumber) {
      parts.push(`Tu signo solar ${sunSign} ${sunSignSymbol} combina con tu Alma ${soulNumber} para darle rumbo emocional a tus decisiones.`);
    }

    return parts.slice(0, 3);
  }, [element, lifePath, chineseZodiac, expressionNumber, chineseElement, sunSign, soulNumber, sunSignSymbol]);

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <div className="mx-auto max-w-content px-4 sm:px-6 py-10 pb-24">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Tus patrones en acción</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground">{name}</h1>
          <p className="text-base text-muted mt-2">Life Path {lifePath} · {sunSign} {sunSignSymbol} · {chineseZodiac}</p>
          <p className="text-sm text-muted mt-4 leading-relaxed max-w-2xl">
            Cómo se manifiesta tu identidad en diferentes áreas de tu vida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Life Path</p>
            <p className="text-4xl font-semibold mt-2" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{lifePath}</p>
            <p className="text-sm text-muted mt-1">Tu dirección principal.</p>
          </Card>
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Expresión</p>
            <p className="text-4xl font-semibold mt-2" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{expressionNumber || "—"}</p>
            <p className="text-sm text-muted mt-1">Cómo te presentás al mundo.</p>
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
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Zodiaco chino</p>
            <p className="text-4xl font-semibold mt-2" style={{ color: ELEMENT_COLORS[chineseElement] || "#D4A843" }}>{chineseZodiac}</p>
            <p className="text-sm text-muted mt-1">{chineseElement}</p>
          </Card>
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Signo solar</p>
            <p className="text-4xl font-semibold mt-2" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{sunSignSymbol}</p>
            <p className="text-sm text-muted mt-1">{sunSign}</p>
          </Card>
        </div>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Tu radar simbólico</h2>
          <Card hover={false} padding="lg">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="currentColor" className="text-border" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 12 }} className="text-muted" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 12 }} className="text-muted" />
                  <Radar name="Perfil" dataKey="value" stroke={ELEMENT_COLORS[element] || "#D4A843"} fill={ELEMENT_COLORS[element] || "#D4A843"} fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Patrones clave</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map((pattern, idx) => (
              <Card key={idx} hover={false} padding="lg">
                <h3 className="font-medium text-foreground mb-2">{pattern.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-3">{pattern.description}</p>
                <p className="text-xs text-muted">Consejo: {pattern.advice}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Ciclos personales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card hover={false} padding="lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Año personal</p>
                <span className="text-2xl font-semibold" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{personalYear || "—"}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background border border-border">
                <div className="h-2 rounded-full bg-foreground" style={{ width: `${((personalYear || 0) / 9) * 100}%` }} />
              </div>
            </Card>
            <Card hover={false} padding="lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Mes personal</p>
                <span className="text-2xl font-semibold" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{personalMonth || "—"}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background border border-border">
                <div className="h-2 rounded-full bg-foreground" style={{ width: `${((personalMonth || 0) / 9) * 100}%` }} />
              </div>
            </Card>
            <Card hover={false} padding="lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium">Día personal</p>
                <span className="text-2xl font-semibold" style={{ color: ELEMENT_COLORS[element] || "#D4A843" }}>{personalDay || "—"}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background border border-border">
                <div className="h-2 rounded-full bg-foreground" style={{ width: `${((personalDay || 0) / 9) * 100}%` }} />
              </div>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Conexiones</h2>
          <Card hover={false} padding="lg">
            <div className="space-y-3">
              {connections.map((text, idx) => (
                <p key={idx} className="text-sm text-muted leading-relaxed">{text}</p>
              ))}
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button fullWidth onClick={() => router.push("/profile")}>Ver mi mapa →</Button>
          </div>
        </section>
      </div>

      <UniversityFooter />
    </div>
  );
}
