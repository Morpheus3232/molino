import type { Metadata } from "next";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import LaLecturaExperience from "./LaLecturaExperience";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ dob?: string; name?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "La Lectura",
    // Contenido personal de una sola persona — no tiene sentido indexarlo.
    robots: { index: false, follow: true },
  };
}

export default async function LecturaPage({ searchParams }: Props) {
  const params = await searchParams;
  const dob = params.dob;
  const name = params.name || "";

  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <p className="text-muted text-sm">
          Esta lectura necesita tu fecha de nacimiento. Volvé a{" "}
          <a href="/profile" className="text-accent underline underline-offset-4">
            tu mapa
          </a>{" "}
          para abrirla de nuevo.
        </p>
      </main>
    );
  }

  const profile = calculateUserProfile(name, dob);
  const catalog = SYMBOLIC_ENTITIES.map(toLightweightEntity);

  return <LaLecturaExperience profile={profile} catalog={catalog} />;
}
