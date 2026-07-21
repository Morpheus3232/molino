"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !date) {
      setError("Completá todos los campos");
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    if (!day || !month || !year || day < 1 || month < 1 || month > 12) {
      setError("Formato de fecha inválido");
      return;
    }

    try {
      const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const calculated = calculateUserProfile(name.trim(), birthDate);
      setProfile(calculated);
    } catch (err) {
      console.error(err);
      setError("Hubo un error generando tu perfil. Intentá de nuevo.");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Cargando...</div>
      </div>
    );
  }

  if (profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
        <div className="max-w-[640px] mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">🌾 Molino</h1>
            <p className="text-sm text-muted">Tu análisis sin guardar datos</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">NOMBRE</p>
              <p className="text-xl font-semibold text-[#1F2937]">{profile.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">FECHA DE NACIMIENTO</p>
              <p className="text-xl font-semibold text-[#1F2937]">{profile.birthDate}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">LIFE PATH</p>
              <p className="text-5xl font-serif font-bold text-[#D4A843]">{profile.lifePath}</p>
            </div>
            <p className="text-xs text-[#9CA3AF] text-center mt-4">
              Esta sesión es efímera. No guardamos nada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      <div className="max-w-[640px] mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">🌾 Molino</h1>
          <p className="text-sm text-muted">Universidad Pública de Libre Acceso</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: María Elena"
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#1F2937] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#1F2937] focus:border-transparent"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-[#1F2937] text-white rounded-full hover:bg-[#374151] transition-colors font-medium text-sm"
          >
            Descubrir mi perfil
          </button>
          <p className="text-xs text-[#9CA3AF] text-center mt-4">
            Esta sesión es efímera. No guardamos nada.
          </p>
        </form>
      </div>
    </div>
  );
}
