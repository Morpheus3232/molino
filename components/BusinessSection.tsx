"use client";

import { motion } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";
import SectionCard from "./SectionCard";
import { Archetype } from "@/lib/data";

interface BusinessSectionProps {
  archetype: Archetype;
}

const BUSINESS_INSIGHTS: Record<number, { style: string; strengths: string[]; ideal: string }> = {
  1: { style: "Liderazgo visionario", strengths: ["Innovación", "Decisión rápida", "Autonomía"], ideal: "Startups y proyectos propios" },
  2: { style: "Colaboración estratégica", strengths: ["Diplomacia", "Trabajo en equipo", "Intuición"], ideal: "Consultoría y mediación" },
  3: { style: "Comunicación creativa", strengths: ["Storytelling", "Branding", "Conexión emocional"], ideal: "Marketing y contenido" },
  4: { style: "Construcción sólida", strengths: ["Procesos", "Confiabilidad", "Planificación"], ideal: "Operaciones y finanzas" },
  5: { style: "Innovación disruptiva", strengths: ["Adaptabilidad", "Networking", "Versatilidad"], ideal: "Ventas y nuevos mercados" },
  6: { style: "Servicio con propósito", strengths: ["Cuidado", "Comunidad", "Calidad"], ideal: "Bienestar y educación" },
  7: { style: "Análisis profundo", strengths: ["Investigación", "Estrategia", "Expertise"], ideal: "Tech y consultoría especializada" },
  8: { style: "Manifestación de poder", strengths: ["Escala", "Negociación", "Visión"], ideal: "Ejecutivo y emprendimiento" },
  9: { style: "Impacto humano", strengths: ["Propósito", "Creatividad", "Visión global"], ideal: "Impacto social y arte" },
  11: { style: "Visión inspiradora", strengths: ["Intuición", "Innovación", "Inspiración"], ideal: "Liderazgo transformacional" },
  22: { style: "Construcción a escala", strengths: ["Manifestación", "Organización", "Visión"], ideal: "Proyectos de gran envergadura" },
  33: { style: "Servicio transformador", strengths: ["Sanación", "Enseñanza", "Compasión"], ideal: "Coaching y bienestar" },
};

export default function BusinessSection({ archetype }: BusinessSectionProps) {
  const insight = BUSINESS_INSIGHTS[archetype.number] || BUSINESS_INSIGHTS[7];

  return (
    <SectionCard delay={0.25}>
      <div className="mb-4 flex items-center gap-2">
        <Briefcase size={18} className="text-gray-400" />
        <div>
          <h3 className="font-serif text-lg font-semibold text-gray-900">Negocios & Marca</h3>
          <p className="text-xs text-gray-500">Tu estilo profesional</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-xl p-4 mb-4"
        style={{ backgroundColor: archetype.colorLight }}
      >
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: archetype.color }}>
          Estilo
        </p>
        <p className="font-serif text-lg font-semibold text-gray-900">{insight.style}</p>
      </motion.div>

      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">
          Fortalezas clave
        </p>
        <div className="flex flex-wrap gap-2">
          {insight.strengths.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-gray-50 p-3">
        <Sparkles size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-gray-500 mb-0.5">Ideal para</p>
          <p className="text-sm text-gray-700">{insight.ideal}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">
          Carreras resonantes
        </p>
        <div className="flex flex-wrap gap-1.5">
          {archetype.careers.slice(0, 6).map((career) => (
            <span
              key={career}
              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600"
            >
              {career}
            </span>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
