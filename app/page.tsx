"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Input from "@/components/ui/Input";
import PhilosophySection from "@/components/sections/PhilosophySection";
import MethodologySection from "@/components/sections/MethodologySection";
import OpenSourceSection from "@/components/sections/OpenSourceSection";

function getCurrentDayNumber(): number {
  const today = new Date();
  const str = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
  let sum = 0;
  for (const char of str) sum += parseInt(char, 10);
  return sum;
}

function reduceToDigit(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    let temp = 0;
    for (const char of String(num)) temp += parseInt(char, 10);
    num = temp;
    if (num === 11 || num === 22 || num === 33) return num;
  }
  return num;
}

function getDayMeaning(num: number): { name: string; description: string; color: string } {
  const meanings: Record<number, any> = {
    1: { name: "Inicio", description: "Nuevos comienzos, liderazgo, independencia.", color: "#D4A843" },
    2: { name: "Cooperación", description: "Equilibrio, diplomacia, relaciones.", color: "#E8B4B8" },
    3: { name: "Expresión", description: "Creatividad, comunicación, optimismo.", color: "#FF8C42" },
    4: { name: "Construcción", description: "Estabilidad, disciplina, trabajo.", color: "#2D5A3D" },
    5: { name: "Cambio", description: "Libertad, aventura, adaptabilidad.", color: "#C44536" },
    6: { name: "Responsabilidad", description: "Servicio, familia, armonía.", color: "#8FBC8F" },
    7: { name: "Introspección", description: "Análisis, sabiduría, introspección.", color: "#4A5568" },
    8: { name: "Manifestación", description: "Poder, logros, abundancia.", color: "#6B4C7A" },
    9: { name: "Compasión", description: "Humanitarismo, cierre, transformación.", color: "#2E5C8A" },
    11: { name: "Iluminación", description: "Intuición elevada, inspiración, conexión espiritual.", color: "#8B5CF6" },
    22: { name: "Construcción Maestra", description: "Visión práctica, manifestación a gran escala.", color: "#4682B4" },
    33: { name: "Amor Universal", description: "Servicio, compasión, transformación global.", color: "#B8860B" },
  };
  return meanings[num] || { name: "Energía", description: "Conectá con tu interior.", color: "#6B7280" };
}

function getChineseYearInfo(year: number) {
  const animals = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];
  const elements = ["Metal", "Agua", "Madera", "Fuego", "Tierra"];
  const emojis = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐐", "🐵", "🐔", "🐶", "🐷"];
  const index = (year - 1900) % 12;
  const elementIndex = Math.floor(((year - 1900) % 10) / 2);
  return {
    animal: animals[index >= 0 ? index : index + 12],
    element: elements[elementIndex >= 0 && elementIndex < 5 ? elementIndex : 0],
    emoji: emojis[index >= 0 ? index : index + 12]
  };
}

export default function Home() {
  const router = useRouter();
  const [demoName, setDemoName] = useState("");
  const [demoDate, setDemoDate] = useState("");
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const today = new Date();
  const dayNumber = reduceToDigit(getCurrentDayNumber());
  const dayMeaning = getDayMeaning(dayNumber);
  const dayOfWeek = today.toLocaleDateString('es-ES', { weekday: 'long' });
  const formattedDate = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const chineseYear = getChineseYearInfo(today.getFullYear());

  const handleDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoName.trim() || !demoDate) return;
    const [year, month, day] = demoDate.split("-").map(Number);
    const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const num = reduceToDigit(dayNumber);
    const ch = getChineseYearInfo(year);
    const sunSign = ["Capricornio","Acuario","Piscis","Aries","Tauro","Géminis","Cáncer","Leo","Virgo","Libra","Escorpio","Sagitario"][Math.min(11, Math.max(0, new Date(birthDate).getMonth()))];
    setDemoResult({
      name: demoName.trim(),
      birthDate,
      lifePath: num,
      sunSign,
      chineseZodiac: ch.animal,
      chineseZodiacInfo: ch,
      archetype: dayMeaning.name,
      archetypeColor: dayMeaning.color,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <section id="conocimiento" className="text-center max-w-4xl mx-auto mb-16">
          <span className="badge mb-4">Personal Intelligence</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-foreground leading-tight mt-4">
            Entendé tus patrones<br/>para tomar mejores decisiones
          </h1>
          <p className="text-muted text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Molino convierte tu fecha de nacimiento y nombre en un mapa de patrones personales. Sin registro. Sin rastreo. 100% transparente.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-sm text-muted">
            <span>🔓 Código abierto</span>
            <span aria-hidden="true">•</span>
            <span>💯 100% gratuito</span>
            <span aria-hidden="true">•</span>
            <span>🕊️ Sin registro</span>
          </div>
        </section>

        <section className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
              <Card>
                <div className="text-center mb-4">
                  <span className="badge mb-3">Demo interactiva</span>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mt-3">Probá tu preview</h2>
                  <p className="text-sm text-muted mt-2">Ingresá tus datos y obtené un vistazo instantáneo a tu perfil simbólico.</p>
                </div>
                <form onSubmit={handleDemo} className="space-y-4">
                  <Input label="Nombre" value={demoName} onChange={(e) => setDemoName(e.target.value)} placeholder="Ej: María Elena" required />
                  <Input label="Fecha de nacimiento" type="date" value={demoDate} onChange={(e) => setDemoDate(e.target.value)} required />
                  <Button type="submit" fullWidth>Ver mi preview</Button>
                </form>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "621+", label: "Entidades analizadas" },
                  { value: "4.9★", label: "Valoración media" },
                  { value: "100%", label: "Gratuito y libre" },
                  { value: "0", label: "Datos guardados" },
                ].map((stat) => (
                  <Card key={stat.label} hover={false} padding="md">
                    <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted mt-1">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Card hover={false} padding="lg">
                <div className="text-center mb-6">
                  <span className="badge mb-3">Tu preview</span>
                  {demoResult ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">NOMBRE</p>
                        <p className="text-2xl font-serif font-bold text-foreground">{demoResult.name}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">FECHA</p>
                        <p className="text-sm text-muted">{demoResult.birthDate}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">LIFE PATH</p>
                        <p className="text-5xl font-serif font-bold" style={{ color: demoResult.archetypeColor }}>{demoResult.lifePath}</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                          <span>🎯</span> {demoResult.archetype}
                        </span>
                        <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                          <span>♈</span> {demoResult.sunSign}
                        </span>
                        <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                          <span>{demoResult.chineseZodiacInfo.emoji}</span> {demoResult.chineseZodiac}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted">
                      <p>Ingresá tus datos para ver el preview</p>
                    </div>
                  )}
                </div>
                <Button fullWidth onClick={() => router.push("/onboarding")}>
                  Descubrí tu perfil completo
                </Button>
              </Card>
            </div>
          </div>
        </section>

        <Section>
          <div className="text-center mb-8">
            <span className="badge mb-3">¿Qué descubrirás?</span>
            <h2 className="text-2xl font-serif font-semibold text-foreground mt-3">Un análisis basado en sistemas simbólicos públicos y accesibles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🔢", title: "Número de Misión de Vida", desc: "Tu propósito fundamental y camino de vida." },
              { icon: "📝", title: "Número de Expresión", desc: "Cómo te presentás al mundo." },
              { icon: "❤️", title: "Número del Alma", desc: "Tus deseos más profundos." },
              { icon: "👤", title: "Número de Personalidad", desc: "Cómo te perciben los demás." },
              { icon: "📅", title: "Año Personal", desc: "La energía de tu año actual." },
              { icon: "🌟", title: "Números Maestros", desc: "Identifica 11, 22 o 33." },
            ].map((item) => (
              <Card key={item.title}>
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-medium text-foreground mt-3">{item.title}</h3>
                <p className="text-sm text-muted mt-1">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="mt-8">
          <div className="text-center mb-8">
            <span className="badge mb-3">Sistemas integrados</span>
            <h2 className="text-2xl font-serif font-semibold text-foreground mt-3">Múltiples marcos de conocimiento</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Numerología", icon: "📚" },
              { name: "Astrología", icon: "🌌" },
              { name: "Zodiaco Chino", icon: "🐉" },
              { name: "Tarot", icon: "🔮" },
              { name: "Human Design", icon: "🧬" },
              { name: "Eneagrama", icon: "🧩" },
            ].map((system) => (
              <Card key={system.name} hover={false} padding="md">
                <div className="text-center">
                  <span className="text-2xl">{system.icon}</span>
                  <p className="text-xs font-medium text-foreground mt-2">{system.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Comenzá ahora</h2>
            <p className="text-muted mb-6 max-w-md mx-auto">Ingresá tu nombre y fecha de nacimiento para descubrir tu perfil de Personal Intelligence.</p>
            <Button size="lg" onClick={() => router.push("/onboarding")}>
              Descubrir mi perfil →
            </Button>
          </div>
        </Section>

        <PhilosophySection />
        <MethodologySection />
        <OpenSourceSection />
      </div>

      <UniversityFooter />
    </div>
  );
}
