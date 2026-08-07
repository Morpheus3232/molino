import dynamic from "next/dynamic";
import UniversityFooter from "@/components/layout/UniversityFooter";

const NumeroDia = dynamic(() => import("@/components/sections/NumeroDia"), { ssr: true, loading: () => <div className="h-[70vh] animate-pulse bg-ink/5 flex items-center justify-center" /> });
const TresPasos = dynamic(() => import("@/components/sections/TresPasos"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const QueDescubris = dynamic(() => import("@/components/sections/QueDescubris"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const TresSistemas = dynamic(() => import("@/components/sections/TresSistemas"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });
const CTAFinal = dynamic(() => import("@/components/sections/CTAFinal"), { ssr: true, loading: () => <div className="h-48 animate-pulse bg-ink/5" /> });
const Testimonial = dynamic(() => import("@/components/social/Testimonial"), { ssr: true });
const TrustMetrics = dynamic(() => import("@/components/social/TrustMetrics"), { ssr: true });
const PersonalizedHomeClient = dynamic(() => import("@/components/sections/PersonalizedHomeClient"), { ssr: true, loading: () => <div className="h-64 animate-pulse bg-ink/5" /> });

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <main id="main-content" className="pt-14">
          <NumeroDia />
          <TresPasos />
          <QueDescubris />
          <TresSistemas />
          <Testimonial />
          <TrustMetrics />
          <CTAFinal />
          <PersonalizedHomeClient />
        </main>
        <UniversityFooter />
      </div>
    </div>
  );
}