"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import { saveUserProfile, getUserProfile } from "@/lib/storage/userProfile";

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = getUserProfile();
    if (saved?.birthDate) {
      router.replace("/profile");
      return;
    }
    setReady(true);
  }, [router]);

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
      const profile = calculateUserProfile(name.trim(), birthDate);
      const profileWithId = { ...profile, id: crypto.randomUUID() };
      saveUserProfile(profileWithId);
      router.replace("/profile");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      <div className="max-w-[430px] mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">🌾 Molino</h1>
          <p className="text-sm text-muted">Descubrí tu identidad simbólica</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB] space-y-4">
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
            className="w-full py-3 bg-[#1F2937] text-white rounded-xl hover:bg-[#374151] transition-colors font-medium text-sm"
          >
            Descubrir mi perfil
          </button>
        </form>

        <p className="text-xs text-[#9CA3AF] mt-6 text-center">
          Todo se calcula en tu navegador. Sin registro. Privacidad total.
        </p>
      </div>
    </div>
  );
}
