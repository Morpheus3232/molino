"use client";
import { useL } from "@/lib/i18n/useL";

import React, { useMemo } from "react";

interface MapHighlightTextProps {
  text: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Renders text and highlights bold segments (**...**) with a distinctive, warm accent style.
 */
export default function MapHighlightText({
  text,
  className = "",
  highlightClassName = "font-bold text-accent-light bg-accent-light/10 px-1 py-0.5 rounded-[--radius-sm]",
}: MapHighlightTextProps) {
  const L = useL();
  const parts = useMemo(() => {
    if (!text) return [];
    // Split by markdown bold **...**
    const tokens = text.split(/(\*\*[^*]+\*\*)/g);
    return tokens.map((token, index) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        const content = token.slice(2, -2);
        return { isBold: true, text: content, key: index };
      }
      return { isBold: false, text: token, key: index };
    });
  }, [text]);

  return (
    <span className={className}>
      {parts.map((part) =>
        part.isBold ? (
          <strong key={part.key} className={highlightClassName}>
            {L.t(part.text)}
          </strong>
        ) : (
          <React.Fragment key={part.key}>{L.t(part.text)}</React.Fragment>
        )
      )}
    </span>
  );
}
