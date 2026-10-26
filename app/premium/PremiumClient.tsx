"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { generatePaywallHook } from "@/lib/engines/synthesisEngine";
import FeatureComparison from "@/components/premium/FeatureComparison";
import PremiumPreview from "@/components/premium/PremiumPreview";
import PremiumCheckout from "@/components/premium/PremiumCheckout";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import { PREMIUM_FAQS } from "@/components/pricing/pricing-data";
import { ShieldCheck, Compass, Heart, Gift } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/knowledge/Kit";

export default function PremiumClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = loadProfileFromStorage();
    if (stored) setProfile(stored as UserProfile);
  }, []);

  const hook = profile ? generatePaywallHook(profile) : null;

  const scrollToCheckout = () => {
    const el = document.getElementById("checkout-box");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-background pt-12 sm:pt-16 pb-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Hero Section */}
        <PageHero
          bare
          crumbs={[{ href: "/", label: "Inicio" }, { label: "Premium" }]}
          eyebrow="Molino Premium · la síntesis"
          title={hook ? hook.question : "Tu mapa completo, sin determinismo"}
          titleClassName={hook ? "text-[clamp(2.5rem,5.5vw,4.5rem)]" : undefined}
          lead={
            hook
              ? hook.context
              : "Tu mapa básico es gratis siempre. Premium conecta numerología, astrología y zodíaco chino en una sola lectura: arquetipos, ciclos y cómo dialogan tus energías. Reflexión honesta, no un oráculo."
          }
          imageKey="paginas/premium"
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={scrollToCheckout}
              className="inline-flex items-center justify-center px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps min-h-[48px]"
            >
              Desbloquear por $8 USD
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("preview-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-lg underline underline-offset-4 hover:no-underline"
            >
              Ver qué incluye
            </button>
          </div>
          <p className="mt-4 text-base text-muted">Pago único. Sin suscripción.</p>
        </PageHero>

        {/* 1. Live Interactive Preview */}
        <div id="preview-section">
          <PremiumPreview onUnlockClick={scrollToCheckout} />
        </div>

        {/* 2. Transparent Feature Comparison */}
        <FeatureComparison />

        {/* 3. Checkout Box */}
        <div className="py-12 max-w-2xl mx-auto">
          <PremiumCheckout
            name={profile?.name}
            birthDate={profile?.birthDate}
            onUnlocked={() => {
              router.push("/lectura");
            }}
          />
        </div>

        {/* 4. Gift Banner */}
        <div className="pb-12 max-w-2xl mx-auto">
          <div className="rounded-xl border border-accent/25 bg-accent/[0.04] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent label-caps">
                <Gift className="w-3.5 h-3.5" />
                ¿Querés regalarle la Lectura a alguien?
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Comprá un mapa de regalo sin saber su fecha
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md">
                Un detalle inolvidable para amigos, pareja o familia. Vos comprás el código y la otra persona ingresa su fecha al canjearlo.
              </p>
            </div>
            <Link
              href="/regalar"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-background rounded-xl font-heading text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition-all shrink-0 w-full sm:w-auto shadow-md label-caps"
            >
              <Gift className="w-4 h-4" />
              Regalar mapa · $8 USD
            </Link>
          </div>
        </div>

        {/* 5. Specific FAQ */}
        <PricingFAQ items={PREMIUM_FAQS} subtitle="Sobre el pago y tus datos." />
      </div>
    </main>
  );
}
