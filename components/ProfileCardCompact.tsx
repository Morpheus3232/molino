"use client";

export default function ProfileCardCompact({ name, birthDate, lifePath, archetype, westernSign }: any) {
  return (
    <div className="bg-gradient-to-br from-[#1F2937] to-[#374151] rounded-2xl p-5 text-white shadow-xl mb-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">Tu perfil</p>
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm opacity-80 mt-1">{birthDate.day}/{birthDate.month}/{birthDate.year}</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-[#D4A843] flex items-center justify-center text-2xl font-bold">{lifePath}</div>
      </div>
      <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
        <div className="flex-1 text-center"><p className="text-2xl">♋</p><p className="text-xs opacity-70">{westernSign}</p></div>
        <div className="flex-1 text-center"><p className="text-2xl">🐷</p><p className="text-xs opacity-70">Cerdo</p></div>
        <div className="flex-1 text-center"><p className="text-2xl">🔢</p><p className="text-xs opacity-70">{archetype}</p></div>
      </div>
    </div>
  );
}
