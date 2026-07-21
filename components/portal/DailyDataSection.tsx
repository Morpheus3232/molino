"use client";

interface DailyDataSectionProps {
  profile: any;
  dayNumber: number;
  dayInfo: { name: string; description: string };
}

export default function DailyDataSection({ profile, dayNumber, dayInfo }: DailyDataSectionProps) {
  const today = new Date();
  const moonPhase = (today.getDate() % 29) < 4 ? "🌑 Luna Nueva" : (today.getDate() % 29) < 8 ? "🌒 Cuarto Creciente" : (today.getDate() % 29) < 12 ? "🌓 Cuarto Creciente" : (today.getDate() % 29) < 16 ? "🌕 Luna Llena" : (today.getDate() % 29) < 20 ? "🌖 Cuarto Menguante" : (today.getDate() % 29) < 24 ? "🌗 Cuarto Menguante" : "🌘 Luna Nueva";

  const planets = [
    { name: "Mercurio", sign: "Aries" },
    { name: "Venus", sign: "Tauro" },
    { name: "Marte", sign: "Géminis" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-[#1F2937] mb-4">📊 Datos del día</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F8F9FA] rounded-2xl p-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">Número del día</p>
          <p className="text-3xl font-serif font-bold mt-2" style={{ color: "#D4A843" }}>{dayNumber}</p>
          <p className="text-sm text-[#6B7280] mt-1">{dayInfo.name}</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-2xl p-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">Fase lunar</p>
          <p className="text-xl font-medium mt-2 text-[#1F2937]">{moonPhase}</p>
          <p className="text-xs text-[#6B7280] mt-1">Ciclo de 29 días</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-2xl p-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">Planetas</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {planets.map((p) => (
              <span key={p.name} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-[#1F2937]">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
