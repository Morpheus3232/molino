"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { Compass, Clover, Heart, Sun, Zap, Globe, Building2, Tag } from "lucide-react";

const categories = [
  {
    micro: "IDENTIDAD",
    title: "TU IDENTIDAD",
    tools: [
      { name: "CAMINO DE VIDA", icon: Compass, href: "/herramientas/camino-de-vida" },
      { name: "NÚMERO DE LA SUERTE", icon: Clover, href: "/onboarding" },
    ],
  },
  {
    micro: "RELACIONES",
    title: "TUS RELACIONES",
    tools: [
      { name: "COMPATIBILIDAD", icon: Heart, href: "/herramientas/compatibilidad" },
      { name: "SIGNO SOLAR", icon: Sun, href: "/herramientas/signo-solar" },
      { name: "ZODÍACO CHINO", icon: Zap, href: "/herramientas/zodiaco-chino" },
    ],
  },
  {
    micro: "CONEXIONES",
    title: "EXPLORÁ CONEXIONES",
    tools: [
      { name: "PAÍSES", icon: Globe, href: "/compatibility/countries" },
      { name: "CIUDADES", icon: Building2, href: "/compatibility/countries" },
      { name: "MARCAS", icon: Tag, href: "/compatibility/brands" },
    ],
  },
];

const cellPad = "p-8 lg:p-12";

export default function ToolsAndDiscovery() {
  return (
    <section className="section-paper-alt">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`${cellPad} px-0`}
        >
          <p className="eyebrow-brutalist mb-4">HERRAMIENTAS Y AFINIDADES</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            EXPLORÁ
            <br />
            TU PERFIL.
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4 max-w-xl leading-relaxed">
            Ingresá tu fecha de nacimiento y descubrí cómo resuena tu energía con cada sistema.
          </p>
        </motion.div>

        {/* Three-column grid */}
        <div className="flex flex-wrap border-t border-ink/10">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.1 }}
              className={`w-full md:w-1/3 flex flex-col ${ci > 0 ? "md:border-l border-ink/10" : ""} border-b md:border-b-0 border-ink/10`}
            >
              <div className={`flex-1 ${cellPad}`}>
                <p className="font-mono text-xs text-accent font-semibold tracking-[0.25em] mb-6">
                  {cat.micro}
                </p>
                <h3 className="font-display text-4xl sm:text-5xl text-foreground leading-[0.9] mb-8">
                  {cat.title}
                </h3>
                <div className="space-y-0">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="group w-full flex items-center gap-4 py-4 border-t border-ink/10 hover:bg-accent/5 transition-colors px-2 -mx-2"
                    >
                      <tool.icon className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
                      <span className="text-sm text-foreground font-medium tracking-wide group-hover:text-accent transition-colors">
                        {tool.name}
                      </span>
                      <span className="ml-auto text-xs text-muted group-hover:text-accent transition-colors">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border-t border-ink/10"
        >
          <div className="accent-block py-6 px-8 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white text-sm font-bold tracking-wide uppercase">
              ¿Listo para descubrir tu mapa?
            </p>
            <Button asChild variant="inverse">
              <Link href="/onboarding">INGRESÁ TU FECHA →</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}