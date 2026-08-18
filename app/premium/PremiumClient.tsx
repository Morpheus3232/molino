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
import { Sparkles, ShieldCheck, ArrowDown, Compass, Heart } from "lucide-react";
import Button from "@/components/ui/Button";

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
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Hero Section */}
        <header className="mb-14 sm:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/25 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              Molino Premium · Síntesis Profunda
            </span>
          </div>

          {hook ? (
            <>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight leading-[1.05]">
                {hook.question}
              </h1>
              <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mt-4 leading-relaxed">
                {hook.context}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight leading-[1.05]">
                Explorá tu mapa completo <br className="hidden sm:inline" />
                <span className="text-accent">sin determinismo</span>
              </h1>
              <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mt-4 leading-relaxed">
                Tu mapa básico es gratuito siempre. Premium conecta numerología, astrología y zodíaco chino en una síntesis única: descubrí arquetipos, ciclos de vida y dinámicas entre tus energías. Una herramienta de reflexión honesta, no un oráculo.
              </p>
            </>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="accent"
              size="lg"
              onClick={scrollToCheckout}
              className="flex items-center gap-2 px-8 py-4 text-base font-bold shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              Desbloquear por $8 USD
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                const el = document.getElementById("preview-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground"
            >
              <ArrowDown className="w-4 h-4" />
              Ver qué incluye
            </Button>
          </div>
        </header>

        {/* 1. Live Interactive Preview */}
        <div id="preview-section">
          <PremiumPreview onUnlockClick={scrollToCheckout} />
        </div>

        {/* 2. Transparent Feature Comparison */}
        <FeatureComparison />

        {/* 3. Checkout Box with Guarantee */}
        <div className="py-12 max-w-2xl mx-auto">
          <PremiumCheckout
            name={profile?.name}
            birthDate={profile?.birthDate}
            onUnlocked={() => {
              router.push("/profile");
            }}
          />
        </div>

        {/* 5. Specific FAQ */}
        <PricingFAQ items={PREMIUM_FAQS} subtitle="Sobre el pago y tus datos." />
      </div>
    </div>
  );
}
