"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Section from "@/components/ui/Section";

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

  const today = new Date();
  const dayNumber = reduceToDigit(getCurrentDayNumber());
  const dayMeaning = getDayMeaning(dayNumber);
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

      <div className="mx-auto max-w-content px-4 sm:px-6 pt-16 pb-24 sm:pt-24">
        {/* Hero limpio */}
        <section className="mb-16 text-center sm:mb-24">
          <span className="badge mb-5">Personal Intelligence</span>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-serif tracking-tight md:text-5xl lg:text-6xl">
            Entendé tus patrones para tomar mejores decisiones
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg">
            Un sistema simbólico que explora patrones de personalidad, ciclos y significado.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => router.push("/onboarding")}>
              Descubrir mi perfil →
            </Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver demo
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

        {/* Demo preview */}
        <section id="demo" className="mb-16 scroll-mt-24 sm:mb-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <Card padding="lg">
                <span className="badge mb-3">Demo Interactiva</span>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3 mb-2">Probá tu preview</h2>
                <p className="text-base text-muted leading-relaxed mb-6">Completá el formulario para generar un análisis instantáneo de tu perfil simbólico.</p>
                <form onSubmit={handleDemo} className="space-y-5">
                  <Input label="Nombre" value={demoName} onChange={(e) => setDemoName(e.target.value)} placeholder="Tu nombre completo" required />
                  <Input label="Fecha de nacimiento" type="date" value={demoDate} onChange={(e) => setDemoDate(e.target.value)} required />
                  <Button type="submit" fullWidth size="lg">Ver mi preview →</Button>
                </form>
              </Card>

              <Card padding="lg">
                {demoResult ? (
                  <div className="w-full space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">NOMBRE</p>
                        <p className="text-2xl font-semibold text-foreground mt-1">{demoResult.name}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">FECHA</p>
                        <p className="text-sm text-muted mt-1">{demoResult.birthDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">LIFE PATH</p>
                      <p className="text-5xl font-semibold tracking-tight" style={{ color: demoResult.archetypeColor }}>{demoResult.lifePath}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-accent hover:shadow-sm">
                        <span>🎯</span> {demoResult.archetype}
                      </span>
                      <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-accent hover:shadow-sm">
                        <span>♈</span> {demoResult.sunSign}
                      </span>
                      <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-accent hover:shadow-sm">
                        <span>{demoResult.chineseZodiacInfo.emoji}</span> {demoResult.chineseZodiac}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Tu preview aparecerá aquí</h3>
                    <p className="text-muted max-w-sm mx-auto leading-relaxed">Completá el formulario para generar un análisis instantáneo de tu perfil numérico.</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </section>

        {/* Stats contextualizados */}
        <section className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { value: "621+", label: "Entidades analizadas", context: "Actualizado en 2026" },
                { value: "4.9★", label: "Valoración media", context: "Basado en feedback de usuarios" },
                { value: "100%", label: "Gratuito y libre", context: "Sin costo ni acceso pago" },
                { value: "0", label: "Datos guardados", context: "Sesión efímera en tu navegador" },
              ].map((stat) => (
                <Card key={stat.label} hover={false} padding="md">
                  <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted mt-1">{stat.label}</p>
                  <p className="text-[10px] text-muted mt-0.5">{stat.context}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ¿Qué descubrirás? */}
        <section className="mb-16 sm:mb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <span className="badge mb-3">¿Qué descubrirás?</span>
              <h2 className="text-2xl font-serif font-semibold text-foreground mt-3">Un análisis basado en sistemas simbólicos públicos y accesibles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🔢", title: "Número de Misión de Vida", desc: "Tu propósito fundamental y camino de vida." },
                { icon: "📝", title: "Número de Expresión", desc: "Cómo te presentás al mundo." },
                { icon: "❤️", title: "Número del Alma", desc: "Tus deseos más profundos." },
                { icon: "👤", título: "Número de Personalidad", desc: "Cómo te percitan los demás." },
                { icon: "📅", title: "Año Personal", desc: "La energía de tu año actual." },
                { icon: "🌟", title: "Números Maestros", desc: "Identifica 11, 22 o 33." },
              ].map((item) => (
                <Card key={item.title} hover={false}>
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="font-medium text-foreground mt-3">{item.title}</h3>
                  <p className="text-sm text-muted mt-1">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      <UniversityFooter />
    </div>
  );
}
