import Link from "next/link";
import HeroClient from "@/components/sections/HeroClient";
import SystemsPreview from "@/components/sections/SystemsPreview";
import Journey from "@/components/sections/Journey";
import ConceptsIndex from "@/components/sections/ConceptsIndex";
import UniversityFooter from "@/components/layout/UniversityFooter";
import PersonalizedHomeClient from "@/components/sections/PersonalizedHomeClient";

/* ═══ Main ═══ */

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <HeroClient hasProfile={false} />
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
          {/* Server-rendered generic home — instant FCP */}
          <SystemsPreview />
          <Journey hasProfile={false} />
          <ConceptsIndex />
        </main>
        <UniversityFooter />
      </div>
      {/* Client island: personalized home (hydrates after JS loads) */}
      <PersonalizedHomeClient />
    </div>
  );
}