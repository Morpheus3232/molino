"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import { saveSession } from "@/lib/storage/ephemeral";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

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
      saveSession({ name: calculated.name, birthDate: calculated.birthDate });
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Hubo un error generando tu perfil. Intentá de nuevo.");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-[640px] mx-auto px-6 py-12">
        <Section>
          <div className="text-center mb-8">
            <span className="badge mb-3">🌾 Molino</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Universidad Pública de Libre Acceso</h1>
            <p className="text-muted text-sm mt-2">Ingresá tus datos para descubrir tu perfil simbólico</p>
          </div>

          <Card hover={false}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nombre"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: María Elena"
                required
              />

              <Input
                label="Fecha de nacimiento"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              {error && <p className="text-sm text-error">{error}</p>}

              <Button type="submit" fullWidth size="lg">
                Descubrir mi perfil
              </Button>
              <p className="text-xs text-muted text-center mt-2">
                Esta sesión es efímera. No guardamos nada.
              </p>
            </form>
          </Card>
        </Section>
      </div>
    </div>
  );
}
