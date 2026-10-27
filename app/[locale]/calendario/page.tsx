import { useL } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import Image from "next/image";
import CalendarioClient from "@/components/calendario/CalendarioClient";
import { metadataFor } from "@/lib/seo";
import { KnowledgeHero, CONTAINER } from "@/components/knowledge/Kit";
import { SectionCredit } from "@/components/ui/SectionCover";
import { getSectionImage } from "@/lib/data/section-images";

export const generateMetadata = metadataFor({
  title: ["Calendario Numerológico", "Numerology Calendar"],
  description:
    ["Cada día del mes reducido a su número y su propósito: descubrí la energía numerológica de cualquier fecha del calendario.", "Every day of the month reduced to its number and its purpose: discover the numerological energy of any date on the calendar."],
  path: "/calendario",
  ogDescription: ["Cada día del mes reducido a su número y su propósito.", "Every day of the month reduced to its number and its purpose."],
});

export default function CalendarioPage() {
  const L = useL();
  const cover = getSectionImage("paginas/calendario");
  return (
    <main id="main-content" className="bg-background">
      <KnowledgeHero
        crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Calendario", "Calendar") }]}
        eyebrow={L("Calendario · el número de cada día", "Calendar · the number of each day")}
        title={L("Calendario numerológico", "Numerology calendar")}
        titleClassName="text-[clamp(3rem,7.5vw,6rem)]"
        lead={L("Cada fecha se suma dígito por dígito hasta quedar en un número del 1 al 9. Cada número tiene su tono: el día para empezar, el día para cerrar.", "Each date is added up digit by digit until it becomes a number from 1 to 9. Each number has its tone: the day to begin, the day to close.")}
        meta={
          <div className="space-y-2">
            <p>{L("Los maestros (11, 22, 33) y el 28, número de la abundancia, no se reducen.", "The master numbers (11, 22, 33) and 28, the number of abundance, are not reduced.")}</p>
            <p>{L(<>
              Tocá cualquier día para ver qué número le toca. También:{" "}
              <Link href="/hoy" className="text-foreground underline underline-offset-4 hover:no-underline">hoy</Link>
              {" · "}
              <Link href="/semana" className="text-foreground underline underline-offset-4 hover:no-underline">tu semana</Link>.
            </>, <>Tap any day to see its number. Also:{" "}<Link href="/hoy" className="text-foreground underline underline-offset-4 hover:no-underline">today</Link>{" · "}<Link href="/semana" className="text-foreground underline underline-offset-4 hover:no-underline">your week</Link>.</>)}</p>
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
