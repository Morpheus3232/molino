import { Link } from "@/lib/i18n/navigation";
import Image from "next/image";
import CalendarioClient from "@/components/calendario/CalendarioClient";
import { createRouteMetadata } from "@/lib/seo";
import { KnowledgeHero, CONTAINER } from "@/components/knowledge/Kit";
import { SectionCredit } from "@/components/ui/SectionCover";
import { getSectionImage } from "@/lib/data/section-images";

export const metadata = createRouteMetadata({
  title: "Calendario Numerológico",
  description:
    "Cada día del mes reducido a su número y su propósito: descubrí la energía numerológica de cualquier fecha del calendario.",
  path: "/calendario",
  ogDescription: "Cada día del mes reducido a su número y su propósito.",
});

export default function CalendarioPage() {
  const cover = getSectionImage("paginas/calendario");
  return (
    <main id="main-content" className="bg-background">
      <KnowledgeHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Calendario" }]}
        eyebrow="Calendario · el número de cada día"
        title="Calendario numerológico"
        titleClassName="text-[clamp(3rem,7.5vw,6rem)]"
        lead="Cada fecha se suma dígito por dígito hasta quedar en un número del 1 al 9. Cada número tiene su tono: el día para empezar, el día para cerrar."
        meta={
          <div className="space-y-2">
            <p>Los maestros (11, 22, 33) y el 28, número de la abundancia, no se reducen.</p>
            <p>
              Tocá cualquier día para ver qué número le toca. También:{" "}
              <Link href="/hoy" className="text-foreground underline underline-offset-4 hover:no-underline">hoy</Link>
              {" · "}
              <Link href="/semana" className="text-foreground underline underline-offset-4 hover:no-underline">tu semana</Link>.
            </p>
          </div>
        }
        aside={
          cover ? (
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden border border-ink/15 bg-paper-alt">
                <Image src={cover.src} alt={cover.alt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
              </div>
              <SectionCredit img={cover} />
            </figure>
          ) : null
        }
      />
      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-20`}>
          <CalendarioClient />
        </div>
      </section>
    </main>
  );
}
