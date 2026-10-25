import Image from "next/image";
import { getSectionImage, type SectionImage } from "@/lib/data/section-images";

const UTM = "?utm_source=molino&utm_medium=referral";

/**
 * Portada 16:9 con crédito, la misma que usan los artículos del blog. Sin
 * imagen registrada para la clave no pinta nada, así una página nueva no se
 * rompe por no tener foto todavía.
 */
export default function SectionCover({
  imageKey,
  priority = false,
  className = "",
}: {
  imageKey: string;
  priority?: boolean;
  className?: string;
}) {
  const img = getSectionImage(imageKey);
  if (!img) return null;

  return (
    <figure className={className}>
      <div className="relative aspect-[16/9] overflow-hidden border border-border bg-paper-alt">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority={priority}
          sizes="(max-width: 1200px) 100vw, 1100px"
          className="object-cover"
        />
      </div>
      <SectionCredit img={img} />
    </figure>
  );
}

/** Pie de crédito: Unsplash pide UTM; las obras de museo enlazan a su ficha. */
export function SectionCredit({
  img,
  className = "mt-2",
}: {
  img: SectionImage;
  className?: string;
}) {
  if (img.source) {
    const same = img.credit.name === img.source.name;
    return (
      <figcaption className={`${className} text-xs text-muted/70`}>
        {img.kind}:{" "}
        <a
          href={img.credit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {img.credit.name}
        </a>
        {!same && (
          <>
            {" "}
            ·{" "}
            <a
              href={img.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {img.source.name}
            </a>
          </>
        )}
        {img.source.name !== "NASA" && ", dominio público"}
      </figcaption>
    );
  }
  return (
    <figcaption className={`${className} text-xs text-muted/70`}>
      {img.kind}:{" "}
      <a
        href={`${img.credit.url}${UTM}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        {img.credit.name}
      </a>{" "}
      en{" "}
      <a
        href={`https://unsplash.com/${UTM}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        Unsplash
      </a>
    </figcaption>
  );
}

/**
 * Dos (o una) portadas lado a lado, con un solo pie: la pareja de signos en
 * /compatibilidad/[par]. Las claves sin imagen se saltean.
 */
export function SectionDiptych({
  imageKeys,
  className = "",
}: {
  imageKeys: string[];
  className?: string;
}) {
  const imgs = [...new Set(imageKeys)]
    .map((k) => getSectionImage(k))
    .filter((i): i is SectionImage => Boolean(i));
  if (imgs.length === 0) return null;

  return (
    <figure className={className}>
      <div className={`grid gap-2 ${imgs.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {imgs.map((img) => (
          <div
            key={img.src}
            className="relative aspect-[4/3] overflow-hidden border border-border bg-paper-alt"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 400px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <SectionCredit img={imgs[0]} />
    </figure>
  );
}
