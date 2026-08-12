import dynamic from "next/dynamic";
import HeroInstrument from "@/components/sections/HeroInstrument";

const TresPasos = dynamic(() => import("@/components/sections/TresPasos"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const QueDescubris = dynamic(() => import("@/components/sections/QueDescubris"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const TresSistemas = dynamic(() => import("@/components/sections/TresSistemas"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const CTAFinal = dynamic(() => import("@/components/sections/CTAFinal"), { ssr: true, loading: () => <div className="h-48 animate-pulse bg-ink/5" /> });
const Testimonial = dynamic(() => import("@/components/social/Testimonial"), { ssr: true });
const TrustMetrics = dynamic(() => import("@/components/social/TrustMetrics"), { ssr: true });
const PersonalizedHomeClient = dynamic(() => import("@/components/sections/PersonalizedHomeClient"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const FAQ = dynamic(() => import("@/components/sections/FAQ"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <main id="main-content" className="pt-16">
          <HeroInstrument />
          <QueDescubris />
          <TresPasos />
          <TresSistemas />
          <Testimonial />
          <TrustMetrics />
          <CTAFinal />
          <PersonalizedHomeClient />
          <FAQ />
        </main>
      </div>
    </div>
  );
}