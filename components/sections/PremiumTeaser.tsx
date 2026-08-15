"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, FileText, Calendar, Users, ShieldCheck, ArrowRight, Check, Coffee } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import Card from "@/components/ui/Card";

const PREMIUM_PERKS = [
  {
    icon: FileText,
    title: "Informe PDF de 25 Páginas",
    desc: "Tu mapa completo maquetado en alta resolución para leer con calma, imprimir o guardar.",
  },
  {
    icon: Calendar,
    title: "Ciclos Anuales 2026–2030",
    desc: "Ciclos personales extendidos de Años y Meses para planificar decisiones importantes.",
  },
  {
    icon: Users,
    title: "Sinergia Vincular Avanzada",
    desc: "Comparativas ilimitadas con socios, familia y pareja con matriz de elementos cruzados.",
  },
];

export default function PremiumTeaser() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
              Molino Premium · Claridad Profunda
            </span>
          </div>

          <motion.h2
            {...fadeUp}
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold tracking-tight leading-[1.08]"
          >
            Tu mapa básico es gratuito.
            <br />
            <span className="text-accent">La profundidad total se desbloquea en un clic.</span>
          </motion.h2>

          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            Sin suscripciones mensuales ocultas. Un único acceso vitalicio de <strong>$8 USD</strong> (menos de lo que cuesta un café de especialidad) con garantía total de 7 días.
          </p>
        </div>

        {/* 3 Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {PREMIUM_PERKS.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                {...fadeUp}
                style={{ transitionDelay: `${i * 0.08}s` }}
                className="h-full"
              >
                <Card padding="lg" className="h-full flex flex-col border-ink/10 bg-card/70 hover:border-accent/30 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed flex-1">
                    {perk.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Value Anchor Comparison Box */}
        <div className="max-w-4xl mx-auto mb-10 rounded-3xl border border-accent/20 bg-card/60 p-6 sm:p-8">
          <div className="text-center sm:text-left mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-1">
              Comparativa de Inversión
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              ¿Por qué $8 USD en pago único?
            </h3>
            <p className="text-xs text-muted mt-1">
              Diseñamos Molino para que el autoconocimiento estructurado no sea un lujo mensual.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-background border border-ink/5 space-y-1">
              <span className="text-[11px] font-mono text-muted block">Consulta Tradicional</span>
              <span className="text-sm font-bold text-foreground line-through opacity-60">$50 – $120 USD</span>
              <p className="text-xs text-muted leading-relaxed">Sesión única de 1 hora, sin reporte interactivo ni actualizaciones.</p>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-ink/5 space-y-1">
              <span className="text-[11px] font-mono text-muted block">Apps con Suscripción</span>
              <span className="text-sm font-bold text-foreground line-through opacity-60">$10 – $15 / mes</span>
              <p className="text-xs text-muted leading-relaxed">Pagos recurrentes forzados ($120/año) y notificaciones de retención.</p>
            </div>

            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 space-y-1 relative">
              <span className="text-[11px] font-mono text-accent font-bold block">Molino Premium</span>
              <span className="text-lg font-bold text-accent">$8 USD · Pago Único</span>
              <p className="text-xs text-foreground/90 leading-relaxed">Menos de un café. Acceso vitalicio, informe de 25 páginas y 0 tracking.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-accent/5 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
              Acceso Único Vitalicio · $8 USD
            </span>
            <h4 className="font-heading text-lg font-bold text-foreground">
              Explorá la vista previa del informe Premium
            </h4>
            <p className="text-xs text-muted">Garantía incondicional de 7 días. 100% de devolución si no te aporta valor.</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/premium"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-gold-foreground font-heading text-xs uppercase tracking-wider font-bold hover:bg-gold-hover transition-colors shadow-sm"
            >
              Ver Detalle Premium <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
