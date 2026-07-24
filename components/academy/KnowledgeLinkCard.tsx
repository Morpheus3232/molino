"use client";

import { motion } from "framer-motion";
import { smoothReveal } from "@/lib/utils/premiumMotion";

interface KnowledgeLinkCardProps {
  title: string;
  origin: string;
  tradition: string;
  relatedLesson?: string;
  icon?: string;
  onClick?: () => void;
}

/**
 * KnowledgeLinkCard — Reusable card that explains the origin of a data point.
 *
 * Shows:
 *   - Title (what the data point is)
 *   - Origin (where it comes from historically)
 *   - Tradition (which cultural system it belongs to)
 *   - Related lesson (optional link to Academy)
 */
export default function KnowledgeLinkCard({
  title,
  origin,
  tradition,
  relatedLesson,
  icon,
  onClick,
}: KnowledgeLinkCardProps) {
  return (
    <motion.div
      {...smoothReveal}
      className="p-4 rounded-xl border border-border bg-background/50"
    >
      <div className="flex items-start gap-3">
        {icon && <span className="text-lg shrink-0">{icon}</span>}
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">{title}</p>
          <p className="text-xs text-foreground leading-relaxed mb-2">{origin}</p>
          <p className="text-[10px] text-muted/70 italic">{tradition}</p>
          {relatedLesson && (
            <button
              type="button"
              onClick={onClick}
              className="mt-2 text-[10px] text-accent hover:underline font-medium"
            >
              {relatedLesson} →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
