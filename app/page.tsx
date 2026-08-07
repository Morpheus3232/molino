import HeroClient from "@/components/sections/HeroClient";
import dynamic from "next/dynamic";
import UniversityFooter from "@/components/layout/UniversityFooter";
import PersonalizedHomeClient from "@/components/sections/PersonalizedHomeClient";

const SystemsPreview = dynamic(() => import("@/components/sections/SystemsPreview"), { ssr: true, loading: () => <div className="h-32 animate-pulse bg-ink/5 rounded-lg" /> });
const Testimonial = dynamic(() => import("@/components/social/Testimonial"), { ssr: true });
const TrustMetrics = dynamic(() => import("@/components/social/TrustMetrics"), { ssr: true });

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <HeroClient hasProfile={false} />
        <main id="main-content">
          <SystemsPreview />
          <Testimonial />
          <TrustMetrics />
          <PersonalizedHomeClient />
        </main>
        <UniversityFooter />
      </div>
    </div>
  );
}