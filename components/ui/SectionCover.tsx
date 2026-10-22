import Image from "next/image";
import { getSectionImage } from "@/lib/data/section-images";

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
      <figcaption className="mt-2 text-xs text-muted/70">
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
    </figure>
  );
}
