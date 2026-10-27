"use client";
import { useL } from "@/lib/i18n/useL";

import { useState, useEffect } from "react";
import { useRouter, Link } from "@/lib/i18n/navigation";
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
import { PageHero } from "@/components/knowledge/Kit";

export default function PremiumClient() {
  const L = useL();
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
          crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: "Premium" }]}
          eyebrow={L("Molino Premium · la síntesis", "Molino Premium · the synthesis")}
          title={L.t(hook ? hook.question : L("Tu mapa completo, sin determinismo", "Your complete map, without determinism"))}
          titleClassName={hook ? "text-[clamp(2.5rem,5.5vw,4.5rem)]" : undefined}
          lead={
            hook
              ? hook.context
              : L("Tu mapa básico es gratis siempre. Premium conecta numerología, astrología y zodíaco chino en una sola lectura: arquetipos, ciclos y cómo dialogan tus energías. Reflexión honesta, no un oráculo.", "Your basic map is always free. Premium connects numerology, astrology and the Chinese zodiac in a single reading: archetypes, cycles and how your energies talk to each other. Honest reflection, not an oracle.")
          }
          imageKey="paginas/premium"
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={scrollToCheckout}
              className="inline-flex items-center justify-center px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps min-h-[48px]"
            >{L("Desbloquear por $8 USD", "Unlock for $8 USD")}</button>
            <button
              type="button"
              onClick={() => document.getElementById("preview-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-lg underline underline-offset-4 hover:no-underline"
            >{L("Ver qué incluye", "See what's included")}</button>
          </div>
          <p className="mt-4 text-base text-muted">{L("Pago único. Sin suscripción.", "One-time payment. No subscription.")}</p>
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
                {L("¿Querés regalarle la Lectura a alguien?", "Want to give the Reading to someone?")}
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{L("Comprá un mapa de regalo sin saber su fecha", "Buy a gift map without knowing their date")}</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md">{L("Un detalle inolvidable para amigos, pareja o familia. Vos comprás el código y la otra persona ingresa su fecha al canjearlo.", "An unforgettable gesture for friends, a partner or family. You buy the code and the other person enters their date when they redeem it.")}</p>
            </div>
            <Link
              href="/regalar"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-background rounded-xl font-heading text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition-all shrink-0 w-full sm:w-auto shadow-md label-caps"
            >
              <Gift className="w-4 h-4" />
              {L("Regalar mapa · $8 USD", "Gift a map · $8 USD")}
            </Link>
          </div>
        </div>

        {/* 5. Specific FAQ */}
        <PricingFAQ items={L.tx(PREMIUM_FAQS)} subtitle={L("Sobre el pago y tus datos.", "About payment and your data.")} />
      </div>
    </main>
  );
}
