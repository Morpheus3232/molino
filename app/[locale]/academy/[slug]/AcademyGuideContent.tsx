"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { AcademyGuide } from "@/lib/data/academy-guides";
import ProfileBridge from "@/components/academy/ProfileBridge";
import SectionCover from "@/components/ui/SectionCover";

export default function AcademyGuideContent({ guide }: { guide: AcademyGuide }) {
  const L = useL();
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">{L(<>
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/academy" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">La Academia</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">{L.t(guide.title)}</span>
        </>, <><Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Home</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><Link href="/academy" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">The Academy</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><span className="text-foreground font-medium" aria-current="page">{L.t(guide.title)}</span></>)}</nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-10 sm:mb-12">
          <p className="text-sm text-accent font-medium mb-4 label-caps">{L("Guía · Aprender", "Guide · Learn")}</p>
          <h1 className="page-title text-foreground mb-6">
            {L.t(guide.title)}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">{L.t(guide.subtitle)}</p>
          <SectionCover imageKey={`academia/${guide.slug}`} priority className="mt-10" />
        </motion.section>

        {/* Qué vas a aprender */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16 p-6 rounded-md border border-border bg-card">
          <p className="text-sm text-muted font-medium mb-3 label-caps">{L("Qué vas a aprender", "What you'll learn")}</p>
          <ul className="space-y-2">
            {guide.whatYouLearn.map((item) => (
              <li key={item} className="text-sm text-foreground leading-relaxed flex gap-2">
                <span className="text-accent shrink-0" aria-hidden="true">—</span>
                <span>{L.t(item)}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Qué es */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{L("Qué es", "What it is")}</h2>
          </div>
          <div className="space-y-4">
            {guide.whatIs.map((p) => (
              <p key={p.slice(0, 40)} className="text-base text-foreground leading-relaxed max-w-3xl">{L.t(p)}</p>
            ))}
          </div>
        </motion.section>

        {/* Cómo funciona */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{L("Cómo funciona", "How it works")}</h2>
          </div>
          <div className="space-y-4">
            {guide.howItWorks.map((p) => (
              <p key={p.slice(0, 40)} className="text-base text-foreground leading-relaxed max-w-3xl">{L.t(p)}</p>
            ))}
          </div>
        </motion.section>

        {/* Cómo lo usa Molino */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{L("Cómo lo usa Molino", "How Molino uses it")}</h2>
          </div>
          <div className="space-y-4">
            {guide.howMolinoUsesIt.map((p) => (
              <p key={p.slice(0, 40)} className="text-base text-foreground leading-relaxed max-w-3xl">{L.t(p)}</p>
            ))}
          </div>
        </motion.section>

        {/* En tu mapa — solo con perfil, componente propio decide si renderiza */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <ProfileBridge cta={guide.exploreLinks[0]} />
        </motion.section>

        {/* Dato / Tradición / Molino */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{L("Dato, tradición y lectura de Molino", "Fact, tradition and Molino's reading")}</h2>
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-md border border-border bg-card">
              <p className="text-sm text-accent font-semibold mb-2 label-caps">{L("Dato", "Fact")}</p>
              <p className="text-sm text-foreground leading-relaxed">{L.t(guide.dato)}</p>
            </div>
            <div className="p-5 rounded-md border border-border bg-card">
              <p className="text-sm text-accent font-semibold mb-2 label-caps">{L("Tradición", "Tradition")}</p>
              <p className="text-sm text-foreground leading-relaxed">{L.t(guide.tradicion)}</p>
            </div>
            <div className="p-5 rounded-md border border-border bg-card">
              <p className="text-sm text-accent font-semibold mb-2 label-caps">{L("Lectura de Molino", "Molino's reading")}</p>
              <p className="text-sm text-foreground leading-relaxed">{L.t(guide.molino)}</p>
            </div>
          </div>
        </motion.section>

        {/* Ejemplos */}
        {guide.examples && guide.examples.length > 0 && (
          <motion.section {...fadeUp} className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{L("Ejemplos", "Examples")}</h2>
            </div>
            <div className="space-y-4">
              {guide.examples.map((ex) => (
                <div key={ex.title} className="p-5 rounded-md border border-border bg-card">
                  <p className="text-sm font-semibold text-foreground mb-2">{L.t(ex.title)}</p>
                  <p className="text-sm text-muted leading-relaxed">{L.t(ex.body)}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Qué NO significa */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-sm text-muted font-medium mb-3 label-caps">{L("Qué NO significa", "What it does NOT mean")}</p>
            <ul className="space-y-2">
              {guide.whatItDoesNotMean.map((item) => (
                <li key={item.slice(0, 40)} className="text-sm text-muted leading-relaxed flex gap-2">
                  <span className="text-accent shrink-0" aria-hidden="true">—</span>
                  <span>{L.t(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Dónde seguir explorando */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{L("Dónde seguir explorando", "Where to keep exploring")}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {guide.exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors px-4 py-2 rounded-md border border-border hover:border-accent/50"
              >
                {L.t(link.label)} →
              </Link>
            ))}
          </div>
        </motion.section>

        {/* CTA contextual */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16 text-center">
          <div className="p-8 rounded-md border border-border bg-card shadow-sm">
            <p className="text-sm text-muted mb-4">{L("¿Querés ver esto aplicado a tu propio mapa?", "Want to see this applied to your own map?")}</p>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >{L("Ver mi mapa", "See my map")}</Link>
          </div>
        </motion.section>

        {/* Volver a la Academia */}
        <motion.section {...fadeUp} className="flex justify-center pt-8 border-t border-border">{L(<>
          <Link href="/academy" className="text-sm text-muted font-medium hover:text-accent transition-colors label-caps">
            La Academia
          </Link>
        </>, <><Link href="/academy" className="text-sm text-muted font-medium hover:text-accent transition-colors label-caps">The Academy</Link></>)}</motion.section>

      </main>
    </div>
  );
}
