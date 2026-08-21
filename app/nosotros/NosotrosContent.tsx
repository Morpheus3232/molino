"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { fadeUp, fadeUpDelayed, staggerItem } from "@/lib/utils/motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const origin = [
  "Molino nació de una frustración simple: pagar una suscripción mensual para leer un cálculo de numerología que se hace con una suma. La numerología pitagórica, la posición de un signo solar, el ciclo del zodíaco chino — nada de eso es un secreto propietario. Es conocimiento documentado hace siglos, y sin embargo casi toda la industria lo empaqueta detrás de un paywall recurrente.",
  "Así que se construyó una herramienta que hace ese cálculo gratis, sin registro, y sin guardar nada en un servidor — porque tu fecha de nacimiento no necesita pasar por la nube para que alguien te diga tu Camino de Vida. Lo que sí se cobra, una sola vez, es la síntesis que conecta todo eso con narrativa e inteligencia artificial — eso sí tiene un costo real de generar, y se dice así de directo.",
  "No hay un equipo de marketing detrás de esto, ni una ronda de inversión, ni una oficina. Es un proyecto que se sostiene con esa lógica: lo que es de todos, gratis; lo que cuesta hacer, se cobra lo justo y se dice por qué.",
];

const beliefs = [
  {
    title: "Conocimiento libre",
    description: "Los sistemas simbólicos no son propiedad de nadie. El cálculo base siempre va a ser gratuito, sin excepción.",
  },
  {
    title: "Privacidad radical",
    description: "Tu fecha de nacimiento se procesa en tu navegador. No hay base de datos de usuarios ni motivo para tenerla.",
  },
  {
    title: "Accesibilidad",
    description: "Sin registro, sin barreras, sin letra chica. Si algo tiene costo, se explica por qué — no se esconde.",
  },
];

const howWeBuiltIt = [
  {
    title: "Código abierto",
    description: "El motor de cálculo está publicado. Cualquiera puede leerlo, auditarlo o encontrar un error y avisar.",
  },
  {
    title: "Cálculo local",
    description: "Numerología, astrología y zodíaco chino se calculan enteramente en tu dispositivo. Nada viaja a un servidor para el mapa gratuito.",
  },
  {
    title: "Transparencia sobre atajos",
    description: "Cuando algo es una aproximación (por ejemplo, un año histórico sin fecha exacta), la interfaz lo dice — no se disfraza de precisión que no existe.",
  },
];

export default function NosotrosContent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
        <nav className="flex items-center gap-2 text-xs text-muted mb-10" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Quiénes somos</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-24 max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]">
            Molino nació de una frustración
          </h1>
          <div className="space-y-5 mt-8">
            {origin.map((paragraph, i) => (
              <p key={i} className="text-base sm:text-lg text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.section>

        {/* Lo que creemos */}
        <motion.section {...fadeUpDelayed(0.05)} className="mb-20" aria-labelledby="creemos-heading">
          <h2 id="creemos-heading" className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-10">
            Lo que creemos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" role="list" aria-label="Lo que creemos">
            {beliefs.map((belief, i) => (
              <motion.div key={belief.title} role="listitem" {...staggerItem}>
                <Card padding="lg" className="h-full">
                  <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-heading text-lg text-foreground mb-2">{belief.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{belief.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Cómo lo construimos */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-20" aria-labelledby="como-heading">
          <h2 id="como-heading" className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-10">
            Cómo lo construimos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" role="list" aria-label="Cómo lo construimos">
            {howWeBuiltIt.map((item, i) => (
              <motion.div key={item.title} role="listitem" {...staggerItem}>
                <Card padding="lg" className="h-full">
                  <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-heading text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Por qué $8 para Premium */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-20 max-w-2xl" aria-labelledby="precio-heading">
          <h2 id="precio-heading" className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-6">
            Por qué $8 para Premium
          </h2>
          <div className="space-y-4 text-base text-muted leading-relaxed">
            <p>
              El mapa gratuito no tiene techo: numerología, astrología, zodíaco chino, ciclos personales, todo eso se calcula en tu navegador y no cuesta nada mantenerlo, así que no se cobra.
            </p>
            <p>
              Lo que sí tiene un costo real es la síntesis con inteligencia artificial: generar esa narrativa integrada consume una llamada a un proveedor de IA por cada perfil, y eso no es gratis para nosotros. $8 USD, pago único, acceso permanente — no una suscripción — es lo que cubre ese costo sin convertir el proyecto en un negocio de recurrencia mensual sobre algo que, en su base, debería ser libre.
            </p>
            <p>
              No es un precio &ldquo;psicológico&rdquo; pensado para maximizar conversión. Es, literalmente, lo que sale sostener la parte de Molino que no se puede correr gratis en un navegador.
            </p>
          </div>
        </motion.section>

        {/* Contacto */}
        <motion.section {...fadeUpDelayed(0.2)} className="mb-20 max-w-2xl border-t border-ink/10 pt-16" aria-labelledby="contacto-heading">
          <h2 id="contacto-heading" className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
            Contacto
          </h2>
          <p className="text-base text-muted leading-relaxed mb-6">
            No hay equipo de soporte ni ticketera. Si encontrás un error, tenés una idea o simplemente querés escribir, llega directo:
          </p>
          <a
            href="mailto:hola@molino.app"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            hola@molino.app
          </a>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUpDelayed(0.25)} className="text-center border-t border-ink/10 pt-16">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground mb-3">
            Conocé tu mapa
          </h2>
          <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
            Generá tu mapa personal en segundos, gratis y sin registro.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link href="/">
              Generá tu mapa
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
          <p className="font-mono text-xs text-muted/70 tracking-wide mt-4">
            Gratis · Sin registro · Sin guardar datos
          </p>
        </motion.section>
      </main>
    </div>
  );
}
