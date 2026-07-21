"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/storage/userProfile";
import ThemeToggle from "@/components/ThemeToggle";
import { getSunSignSymbol } from "@/lib/engines/astrologyEngine";

// ============================================
// FUNCIONES DE CÁLCULO DEL DÍA (CORREGIDAS)
// ============================================

function getCurrentDayNumber(): number {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  // Suma todos los dígitos
  const str = `${day}${month}${year}`;
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

// Desglose del cálculo para mostrar
function getDayCalculation(today: Date): { steps: string[]; result: number } {
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const directSum = day + month + year;
  const dateStr = `${day}${month}${year}`;
  let digitSum = 0;
  const digitSteps: string[] = [];
  for (const char of dateStr) {
    digitSum += parseInt(char, 10);
    digitSteps.push(char);
  }

  const reduced = reduceToDigit(digitSum);

  const step1 = `${day} + ${month} + ${year} = ${directSum}`;
  const step2 = `(${digitSteps.join("+")}) = ${digitSum}`;
  const step3 = digitSum > 9 && reduced !== digitSum ? `${digitSum} → ${reduced}` : `${digitSum}`;

  const steps = [step1, step2, step3];

  return { steps, result: reduced };
}

function getDayMeaning(num: number): { name: string; description: string; color: string; gradient: string } {
  const meanings: Record<number, any> = {
    1: { name: "Inicio", description: "Nuevos comienzos, liderazgo, independencia.", color: "#D4A843", gradient: "from-[#D4A843] to-[#F5E6C8]" },
    2: { name: "Cooperación", description: "Equilibrio, diplomacia, relaciones.", color: "#E8B4B8", gradient: "from-[#E8B4B8] to-[#F5E0E3]" },
    3: { name: "Expresión", description: "Creatividad, comunicación, optimismo.", color: "#FF8C42", gradient: "from-[#FF8C42] to-[#FFE4D1]" },
    4: { name: "Construcción", description: "Estabilidad, disciplina, trabajo.", color: "#2D5A3D", gradient: "from-[#2D5A3D] to-[#D4E5D8]" },
    5: { name: "Cambio", description: "Libertad, aventura, adaptabilidad.", color: "#C44536", gradient: "from-[#C44536] to-[#F5D5D0]" },
    6: { name: "Responsabilidad", description: "Servicio, familia, armonía.", color: "#8FBC8F", gradient: "from-[#8FBC8F] to-[#E0F0E0]" },
    7: { name: "Introspección", description: "Análisis, sabiduría, introspección.", color: "#4A5568", gradient: "from-[#4A5568] to-[#D8DEE4]" },
    8: { name: "Manifestación", description: "Poder, logros, abundancia.", color: "#6B4C7A", gradient: "from-[#6B4C7A] to-[#E0D5E8]" },
    9: { name: "Compasión", description: "Humanitarismo, cierre, transformación.", color: "#2E5C8A", gradient: "from-[#2E5C8A] to-[#D0E0F0]" },
    11: { name: "Iluminación", description: "Intuición elevada, inspiración, conexión espiritual.", color: "#8B5CF6", gradient: "from-[#8B5CF6] to-[#E5D5FF]" },
    22: { name: "Construcción Maestra", description: "Visión práctica, manifestación a gran escala.", color: "#4682B4", gradient: "from-[#4682B4] to-[#D0E0F0]" },
    33: { name: "Amor Universal", description: "Servicio, compasión, transformación global.", color: "#B8860B", gradient: "from-[#B8860B] to-[#F5E6C8]" },
  };
  return meanings[num] || { name: "Energía", description: "Conectá con tu interior.", color: "#6B7280", gradient: "from-[#6B7280] to-[#E5E7EB]" };
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
  const dayCalc = getDayCalculation(today);

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
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-card-border">
        <div className="max-w-[430px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-serif font-bold text-lg text-foreground">🌾 Molino</span>
            <nav className="hidden sm:flex gap-4 text-muted">
              <a href="#significados" className="hover:text-foreground transition-colors">Significados</a>
              <a href="#testimonios" className="hover:text-foreground transition-colors">Testimonios</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {profile ? (
              <button
                onClick={() => router.push("/profile")}
                className="text-sm text-foreground hover:text-[var(--accent)] transition-colors"
              >
                Mi perfil
              </button>
            ) : null}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-[430px] mx-auto px-4 py-6 pb-24">
        {/* ============================================ */}
        {/* HERO */}
        {/* ============================================ */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Astrología &amp; Numerología integrada</h1>
          <p className="text-muted text-sm mt-2">
            Descubre los secretos que los números de tu nombre y fecha de nacimiento revelan sobre tu personalidad, propósito y destino.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted">
            <span>🔒 Privacidad total</span>
            <span>•</span>
            <span>💯 100% Gratuito</span>
            <span>•</span>
            <span>📝 Sin registro</span>
          </div>
        </div>

        {/* ============================================ */}
        {/* NÚMERO DEL DÍA */}
        {/* ============================================ */}
        <div className={`bg-gradient-to-br ${dayMeaning.gradient} rounded-3xl p-6 text-white shadow-xl mb-8 text-center relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <p className="text-xs opacity-70 tracking-wider relative z-10">NÚMERO DEL DÍA · {dayOfWeek}, {formattedDate}</p>
          <div className="flex flex-col items-center mt-4 relative z-10">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl font-bold font-serif shadow-2xl border-4 border-white/30" style={{ backgroundColor: dayMeaning.color }}>
              {dayNumber}
            </div>
            <h2 className="text-2xl font-serif font-bold mt-4">{dayMeaning.name}</h2>
            <p className="text-sm opacity-80 max-w-xs mt-2">{dayMeaning.description}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-70 font-mono relative z-10">
            {dayCalc.steps.join(' → ')}
          </div>
          <div className="mt-3 flex justify-center gap-4 text-xs opacity-70 relative z-10">
            <span>{chineseYear.emoji} {chineseYear.animal} de {chineseYear.element}</span>
          </div>
        </div>

        {/* ============================================ */}
        {/* STATS */}
        {/* ============================================ */}
        <div className="flex justify-around bg-white rounded-2xl shadow-lg p-4 border border-[#E5E7EB] mb-8">
          {[
            { value: "50K+", label: "Análisis realizados" },
            { value: "4.9★", label: "Valoración media" },
            { value: "100%", label: "Gratuito y privado" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ============================================ */}
        {/* FORMULARIO */}
        {/* ============================================ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB] mb-8">
          <h2 className="text-xl font-serif font-semibold text-foreground text-center mb-2">Descubrí tu potencial</h2>
          <p className="text-sm text-muted text-center mb-4">Ingresá tus datos para tu análisis completo</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/onboarding");
            }}
            className="space-y-4"
          >
            <button
              type="submit"
              className="w-full py-3 bg-[#1F2937] text-white rounded-xl hover:bg-[#374151] transition-colors font-medium text-sm"
            >
              Comenzar mi análisis
            </button>
          </form>
          <p className="text-xs text-[#9CA3AF] mt-3 text-center">Todo se calcula en tu navegador. No guardamos nada.</p>
        </div>

        {/* ============================================ */}
        {/* ¿QUÉ DESCUBRIRÁS? */}
        {/* ============================================ */}
        <div className="mb-8">
          <h2 className="text-xl font-serif font-semibold text-foreground text-center mb-4">¿Qué descubrirás?</h2>
          <p className="text-sm text-muted text-center mb-6">
            Un análisis numerológico completo basado en la tabla pitagórica, que abarca múltiples dimensiones de tu ser.
          </p>
          <div className="grid gap-4">
            {[
              { icon: "🔢", title: "Número de Misión de Vida", desc: "Descubre tu propósito fundamental basado en tu fecha de nacimiento." },
              { icon: "📝", title: "Número de Expresión", desc: "Revela cómo te presentas al mundo a través de tu nombre completo." },
              { icon: "❤️", title: "Número del Alma", desc: "Conoce tus deseos más profundos y lo que tu corazón realmente anhela." },
              { icon: "👤", title: "Número de Personalidad", desc: "Descubre cómo los demás te perciben a primera vista." },
              { icon: "📅", title: "Año Personal", desc: "Entiende la energía que rige tu año actual y cómo aprovecharla." },
              { icon: "🌟", title: "Números Maestros", desc: "Identifica si tienes números maestros (11, 22, 33) en tu carta." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-4 border border-[#E5E7EB]">
                <h3 className="font-serif font-semibold text-foreground">{item.icon} {item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* LOS NÚMEROS Y SUS SIGNIFICADOS */}
        {/* ============================================ */}
        <div id="significados" className="mb-8">
          <h2 className="text-xl font-serif font-semibold text-foreground text-center mb-4">Los Números y sus Significados</h2>
          <p className="text-sm text-muted text-center mb-6">
            Cada número del 1 al 9 (y los maestros 11, 22, 33) tiene una vibración única que influye en tu vida.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {numbers.map((item) => (
              <div
                key={item.num}
                className="bg-white rounded-2xl shadow-md p-4 text-center border border-[#E5E7EB]"
                style={{ borderTop: `4px solid ${item.color}` }}
              >
                <p className="text-2xl font-bold font-serif" style={{ color: item.color }}>{item.num}</p>
                <p className="text-xs font-semibold text-foreground mt-1">{item.name}</p>
                <p className="text-[10px] text-muted">{item.element}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-[#1F2937] hover:underline font-medium">
              Ver todos los significados →
            </a>
          </div>
        </div>

        {/* ============================================ */}
        {/* CÓMO FUNCIONA */}
        {/* ============================================ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB] mb-8">
          <h2 className="text-xl font-serif font-semibold text-foreground text-center mb-4">¿Cómo funciona?</h2>
          <p className="text-sm text-muted text-center mb-4">
            La numerología pitagórica asigna un valor numérico a cada letra del alfabeto.
          </p>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter, i) => {
              const val = (i % 9) + 1;
              return (
                <div key={letter} className="flex flex-col items-center">
                  <span className="font-mono font-medium text-foreground">{letter}</span>
                  <span className="text-xs text-muted">{val}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted mt-4 text-center">
            Cada letra se reduce a un dígito del 1 al 9, y luego se suman y reducen para obtener tu número final.
          </p>
        </div>

        {/* ============================================ */}
        {/* TESTIMONIOS */}
        {/* ============================================ */}
        <div id="testimonios" className="mb-8">
          <h2 className="text-xl font-serif font-semibold text-foreground text-center mb-4">Lo que dicen nuestros usuarios</h2>
          <p className="text-sm text-muted text-center mb-6">Miles de personas ya descubrieron su potencial con Molino.</p>
          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-4 border border-[#E5E7EB]">
                <p className="text-sm text-foreground/80">"{t.text}"</p>
                <p className="text-xs text-muted mt-2">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* CTA FINAL */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-[#1F2937] to-[#374151] rounded-3xl p-6 text-white text-center shadow-xl">
          <h2 className="text-2xl font-serif font-bold">¿Listo para descubrir tu potencial?</h2>
          <p className="text-sm opacity-80 mt-2">Tu análisis numerológico completo te espera. Solo necesitas tu nombre y fecha de nacimiento.</p>
          <button
            onClick={() => router.push("/onboarding")}
            className="mt-4 px-8 py-3 bg-white text-[#1F2937] rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
          >
            Comenzar mi análisis
          </button>
        </div>

        {/* ============================================ */}
        {/* FOOTER */}
        {/* ============================================ */}
        <footer className="text-center mt-8 text-xs text-[#9CA3AF]">
          <p>Molino · Astrología &amp; Numerología integrada. Todo se calcula en tu navegador.</p>
          <p className="mt-1">💯 100% Gratuito · 📝 Sin registro · 🔒 Privacidad total</p>
        </footer>
      </div>
    </div>
  );
}
