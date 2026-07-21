"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/storage/userProfile";
import ThemeToggle from "@/components/ThemeToggle";

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

function getPersonalYear(birthDate: string): number {
  if (!birthDate) return 0;
  const [year, month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  const currentYear = today.getFullYear();

  const sum = day + month + currentYear;

  let reduced = sum;
  if (reduced === 11 || reduced === 22 || reduced === 33) return reduced;
  while (reduced > 9) {
    let temp = 0;
    for (const char of String(reduced)) temp += parseInt(char, 10);
    reduced = temp;
    if (reduced === 11 || reduced === 22 || reduced === 33) return reduced;
  }
  return reduced;
}

function getPersonalYearMeaning(num: number): { name: string; description: string } {
  const meanings: Record<number, any> = {
    1: { name: "Nuevos Comienzos", description: "Es el año para iniciar proyectos y tomar el liderazgo." },
    2: { name: "Cooperación", description: "Año para construir relaciones y asociaciones." },
    3: { name: "Expresión", description: "Año para crear, comunicar y compartir tu arte." },
    4: { name: "Construcción", description: "Año para trabajar duro y establecer bases sólidas." },
    5: { name: "Cambio", description: "Año para liberarte, viajar y explorar nuevas oportunidades." },
    6: { name: "Responsabilidad", description: "Año para enfocarte en el hogar, la familia y el servicio." },
    7: { name: "Introspección", description: "Año para reflexionar, estudiar y conectar con tu interior." },
    8: { name: "Manifestación", description: "Año para lograr metas, poder y abundancia." },
    9: { name: "Cierre", description: "Año para finalizar ciclos y prepararte para nuevos comienzos." },
    11: { name: "Iluminación", description: "Año de intuición elevada y despertar espiritual." },
    22: { name: "Construcción Maestra", description: "Año para materializar grandes visiones." },
    33: { name: "Amor Universal", description: "Año de servicio y compasión." },
  };
  return meanings[num] || { name: "Energía", description: "Conectá con tu energía personal." };
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
    setIsLoading(false);
  }, []);

  const today = new Date();
  const dayNumber = reduceToDigit(getCurrentDayNumber());
  const dayMeaning = getDayMeaning(dayNumber);
  const dayOfWeek = today.toLocaleDateString('es-ES', { weekday: 'long' });
  const formattedDate = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const chineseYear = getChineseYearInfo(today.getFullYear());

  const numbers = [
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

  const testimonials = [
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-serif font-bold text-xl text-[#1F2937]">🌾 Molino</span>
            <nav className="hidden md:flex gap-6 text-sm text-[#6B7280]">
              <a href="#significados" className="hover:text-[#1F2937] transition-colors">Significados</a>
              <a href="#testimonios" className="hover:text-[#1F2937] transition-colors">Testimonios</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {profile && (
              <button
                onClick={() => router.push("/profile")}
                className="text-sm text-[#1F2937] hover:text-[#D4A843] transition-colors"
              >
                Mi perfil
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-[#1F2937] leading-tight">
            Astrología &amp; Numerología<br/>integradas
          </h1>
          <p className="text-[#6B7280] text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Descubre los secretos que los números de tu nombre y fecha de nacimiento revelan sobre tu personalidad, propósito y destino.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-sm text-[#6B7280]">
            <span>🔒 Privacidad total</span>
            <span className="text-gray-300">•</span>
            <span>💯 100% Gratuito</span>
            <span className="text-gray-300">•</span>
            <span>📝 Sin registro</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            {profile && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">TU AÑO PERSONAL</p>
                <div className="mt-2">
                  <span className="inline-block text-5xl font-serif font-bold text-[#D4A843]">{getPersonalYear(profile.birthDate)}</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#1F2937] mt-1">{getPersonalYearMeaning(getPersonalYear(profile.birthDate)).name}</h3>
                <p className="text-[#6B7280] text-sm mt-2 max-w-xs mx-auto">{getPersonalYearMeaning(getPersonalYear(profile.birthDate)).description}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "50K+", label: "Análisis realizados" },
                { value: "4.9★", label: "Valoración media" },
                { value: "100%", label: "Gratuito y privado" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                  <p className="text-xl font-semibold text-[#1F2937]">{stat.value}</p>
                  <p className="text-xs text-[#6B7280]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
              <h2 className="text-2xl font-serif font-semibold text-[#1F2937]">Descubrí tu potencial</h2>
              <p className="text-[#6B7280] text-sm mt-2">Ingresá tus datos para tu análisis completo</p>
              <button onClick={() => router.push("/onboarding")} className="mt-6 w-full py-4 bg-[#1F2937] text-white rounded-full hover:bg-[#374151] transition-colors font-medium text-sm">Comenzar mi análisis</button>
              <p className="text-xs text-[#9CA3AF] text-center mt-4">Todo se calcula en tu navegador. No guardamos nada.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-serif font-semibold text-[#1F2937] text-center">¿Qué descubrirás?</h2>
              <p className="text-[#6B7280] text-sm text-center mt-2 max-w-md mx-auto">Un análisis numerológico completo basado en la tabla pitagórica.</p>
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

        <div className="mt-16 space-y-16">
          <div id="significados" className="text-center">
            <h2 className="text-3xl font-serif font-semibold text-[#1F2937]">Los Números y sus Significados</h2>
            <p className="text-[#6B7280] text-base mt-2 max-w-2xl mx-auto">Cada número del 1 al 9 (y los maestros 11, 22, 33) tiene una vibración única.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 max-w-4xl mx-auto">
              {numbers.map((item) => (
                <div key={item.num} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
                  <p className="text-3xl font-serif font-bold" style={{ color: item.color }}>{item.num}</p>
                  <p className="text-sm font-medium text-[#1F2937] mt-1">{item.name}</p>
                  <p className="text-xs text-[#6B7280]">{item.element}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-semibold text-[#1F2937] text-center">¿Cómo funciona?</h2>
            <p className="text-[#6B7280] text-sm text-center mt-2">La numerología pitagórica asigna un valor numérico a cada letra del alfabeto.</p>
            <div className="grid grid-cols-7 gap-0.5 text-center text-xs mt-4">
              {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter, i) => {
                const val = (i % 9) + 1;
                return (
                  <div key={letter} className="bg-[#F8F9FA] rounded py-1">
                    <span className="font-mono font-medium text-[#1F2937]">{letter}</span>
                    <span className="text-[#6B7280] block text-[10px]">{val}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[#6B7280] text-center mt-4">Cada letra se reduce a un dígito del 1 al 9, luego se suman y reducen para obtener tu número final.</p>
          </div>

          <div id="testimonios" className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-semibold text-[#1F2937] text-center">Lo que dicen nuestros usuarios</h2>
            <p className="text-[#6B7280] text-base text-center mt-2">Miles de personas ya descubrieron su potencial.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <p className="text-[#1F2937] text-base leading-relaxed">"{t.text}"</p>
                  <p className="text-sm text-[#6B7280] mt-3">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1F2937] rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">¿Listo para descubrir tu potencial?</h2>
            <p className="text-white/70 text-base mt-2 max-w-md mx-auto">Tu análisis numerológico completo te espera. Solo necesitas tu nombre y fecha de nacimiento.</p>
            <button onClick={() => router.push("/onboarding")} className="mt-6 px-8 py-3 bg-white text-[#1F2937] rounded-full hover:bg-gray-100 transition-colors font-medium text-sm">Comenzar mi análisis</button>
          </div>

          <footer className="text-center text-sm text-[#9CA3AF]">
            <p>Molino · Astrología &amp; Numerología integrada. Todo se calcula en tu navegador.</p>
            <p className="mt-1">💯 100% Gratuito · 📝 Sin registro · 🔒 Privacidad total</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
