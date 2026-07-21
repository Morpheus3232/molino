"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import PhilosophySection from "@/components/sections/PhilosophySection";
import MethodologySection from "@/components/sections/MethodologySection";
import OpenSourceSection from "@/components/sections/OpenSourceSection";
import UniversityFooter from "@/components/layout/UniversityFooter";

// ============================================
// FUNCIONES DE CÁLCULO
// ============================================

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

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Home() {
  const router = useRouter();
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

  const numbers: { num: number; name: string; element: string; color: string }[] = [
    { num: 1, name: "El Líder", element: "Fuego", color: "#D4A843" },
    { num: 2, name: "El Diplomático", element: "Agua", color: "#E8B4B8" },
    { num: 3, name: "El Comunicador", element: "Aire", color: "#FF8C42" },
    { num: 4, name: "El Constructor", element: "Tierra", color: "#2D5A3D" },
    { num: 5, name: "El Aventurero", element: "Aire", color: "#C44536" },
    { num: 6, name: "El Nutridor", element: "Agua", color: "#8FBC8F" },
    { num: 7, name: "El Buscador", element: "Agua", color: "#4A5568" },
    { num: 8, name: "El Ejecutivo", element: "Tierra", color: "#6B4C7A" },
    { num: 9, name: "El Misterio", element: "Éter", color: "#2E5C8A" },
  ];

  const testimonials: { name: string; text: string }[] = [
    { name: "María G.", text: "Increíblemente preciso. El número de mi misión de vida resuena profundamente con lo que siempre sentí." },
    { name: "Carlos R.", text: "La compatibilidad con mi pareja fue reveladora. Nos ayudó a entendernos mucho mejor." },
    { name: "Lucía M.", text: "Uso el número del día cada mañana. Es como tener un horóscopo personalizado basado en matemáticas." },
    { name: "Andrés P.", text: "El diseño es hermoso y la privacidad es total. Ninguna app de astrología se compara." },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <UniversityHeader />

      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-[#1F2937] leading-tight">
            Universidad Pública<br/>de Libre Acceso
          </h1>
          <p className="text-[#6B7280] text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            El conocimiento simbólico es patrimonio de la humanidad. Explorá sistemas simbólicos sin registro, sin rastreo y sin restricciones.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-sm text-[#6B7280]">
            <span>🔓 Código abierto</span>
            <span className="text-gray-300">•</span>
            <span>💯 100% gratuito</span>
            <span className="text-gray-300">•</span>
            <span>🕊️ Sin registro</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">NÚMERO DEL DÍA · {dayOfWeek}, {formattedDate}</p>
              <div className="mt-4">
                <span className="inline-block text-7xl md:text-8xl font-serif font-bold" style={{ color: dayMeaning.color }}>{dayNumber}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#1F2937] mt-2">{dayMeaning.name}</h2>
              <p className="text-[#6B7280] text-base mt-2 max-w-xs mx-auto">{dayMeaning.description}</p>
              <div className="mt-4 text-xs text-[#6B7280] font-mono bg-[#F8F9FA] rounded-full px-4 py-2 inline-block">
                {today.getDate()} + {today.getMonth() + 1} + {today.getFullYear()} = {today.getDate() + today.getMonth() + 1 + today.getFullYear()} → {dayNumber}
              </div>
              <div className="mt-3 text-sm text-[#6B7280]">
                <span>{chineseYear.emoji} {chineseYear.animal} de {chineseYear.element}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "50K+", label: "Análisis realizados" },
                { value: "4.9★", label: "Valoración media" },
                { value: "100%", label: "Gratuito y libre" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                  <p className="text-xl font-semibold text-[#1F2937]">{stat.value}</p>
                  <p className="text-xs text-[#6B7280]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
              <h2 className="text-2xl font-serif font-semibold text-[#1F2937]">Accedé al conocimiento simbólico</h2>
              <p className="text-[#6B7280] text-sm mt-2">Sin registro. Sin datos guardados. Sin restricciones.</p>
              <button onClick={() => router.push("/onboarding")} className="mt-6 w-full py-4 bg-[#1F2937] text-white rounded-full hover:bg-[#374151] transition-colors font-medium text-sm">Comenzar exploración</button>
              <p className="text-xs text-[#9CA3AF] text-center mt-4">Todo se calcula en tu navegador. No guardamos nada.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-serif font-semibold text-[#1F2937] text-center">¿Qué descubrirás?</h2>
              <p className="text-[#6B7280] text-sm text-center mt-2 max-w-md mx-auto">Un análisis basado en sistemas simbólicos públicos y accesibles.</p>
              <div className="grid gap-3 mt-6">
                {[
                  { icon: "🔢", title: "Número de Misión de Vida", desc: "Tu propósito fundamental." },
                  { icon: "📝", title: "Número de Expresión", desc: "Cómo te presentas al mundo." },
                  { icon: "❤️", title: "Número del Alma", desc: "Tus deseos más profundos." },
                  { icon: "👤", title: "Número de Personalidad", desc: "Cómo te perciben los demás." },
                  { icon: "📅", title: "Año Personal", desc: "La energía de tu año actual." },
                  { icon: "🌟", title: "Números Maestros", desc: "Identifica 11, 22 o 33." },
                ].map((item) => (
                  <div key={item.title} className="bg-[#F8F9FA] rounded-2xl p-4 flex gap-4 items-start">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-medium text-[#1F2937]">{item.title}</h3>
                      <p className="text-sm text-[#6B7280]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PhilosophySection />
        <MethodologySection />
        <OpenSourceSection />
        <UniversityFooter />
      </div>
    </div>
  );
}
