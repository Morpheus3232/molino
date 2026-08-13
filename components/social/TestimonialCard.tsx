"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { fadeUpDelayed } from "@/lib/utils/motion";
import Card from "@/components/ui/Card";

export interface TestimonialProps {
  name: string;
  location: string;
  quote: string;
  avatarUrl?: string;
}

function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export default function TestimonialCard({
  name,
  location,
  quote,
  avatarUrl,
  delay = 0,
}: TestimonialProps & { delay?: number }) {
  return (
    <motion.figure {...fadeUpDelayed(delay)} className="h-full">
      <Card padding="lg" hover={false} className="h-full flex flex-col">
        <header className="flex items-center gap-3 mb-5">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={`Foto de perfil de ${name}`}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              role="img"
              aria-label={`Foto de perfil de ${name}`}
              className="w-12 h-12 rounded-full bg-ink/5 text-accent flex items-center justify-center font-heading text-lg font-semibold shrink-0"
            >
              {initials(name)}
            </div>
          )}
          <figcaption className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{name}</p>
            <p className="text-xs text-muted/70">{location}</p>
          </figcaption>
        </header>

        <Quote className="w-8 h-8 text-accent/20 mb-4" aria-hidden="true" />

        <blockquote className="text-sm sm:text-base text-foreground/80 leading-relaxed flex-1">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </Card>
    </motion.figure>
  );
}
