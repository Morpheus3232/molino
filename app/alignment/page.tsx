"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function AlignmentPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">✨ Tu alineación</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Recomendaciones personalizadas</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Basadas en tu perfil: carrera, comunicación, entornos, colores y símbolos.</p>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Carrera alineada", icon: "🚀", desc: "Profesiones y roles que resuenan con tu Life Path y arquetipo." },
              { title: "Comunicación", icon: "💬", desc: "Estilos de comunicación efectivos según tu Expression Number." },
              { title: "Entornos", icon: "🌍", desc: "Ambientes, culturas y lugares con mayor afinidad." },
              { title: "Símbolos personales", icon: "🔢", desc: "Números, colores y formas que potencian tu energía." },
              { title: "Relaciones", icon: "❤️", desc: "Compatibilidades y vínculos según tu perfil." },
              { title: "Ritmos", icon: "⏳", desc: "Mejores momentos para iniciar, pausar y cerrar ciclos." },
            ].map((item) => (
              <Card key={item.title} hover padding="md">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-semibold text-foreground mt-3">{item.title}</h3>
                <p className="text-sm text-muted mt-1">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="mt-8">
          <Card hover={false}>
            <div className="text-center">
              <span className="badge mb-3">Próximamente</span>
              <h2 className="font-serif text-xl font-semibold text-foreground mt-3">Motor de alineación</h2>
              <p className="text-sm text-muted mt-2">Próximamente verás recomendaciones accionables basadas en tu perfil simbólico.</p>
              <Button className="mt-4" onClick={() => router.push("/profile")}>Volver a mi perfil</Button>
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
