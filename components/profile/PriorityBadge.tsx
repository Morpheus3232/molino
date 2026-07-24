"use client";

import type { PriorityLevel } from "@/lib/engines/personalRecommendationEngine";

const PRIORITY_STYLES: Record<PriorityLevel, { stars: string; color: string; bg: string }> = {
  5: { stars: "★★★★★", color: "#2D5A3D", bg: "rgba(45,90,61,0.08)" },
  4: { stars: "★★★★☆", color: "#4A6FA5", bg: "rgba(74,111,165,0.08)" },
  3: { stars: "★★★☆☆", color: "#D4A843", bg: "rgba(212,168,67,0.08)" },
  2: { stars: "★★☆☆☆", color: "#B45309", bg: "rgba(180,83,9,0.08)" },
  1: { stars: "★☆☆☆☆", color: "#9CA3AF", bg: "rgba(156,163,175,0.08)" },
};

export default function PriorityBadge({
  priority,
  label,
  showLabel = true,
}: {
  priority: PriorityLevel;
  label?: string;
  showLabel?: boolean;
}) {
  const style = PRIORITY_STYLES[priority];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium" style={{ color: style.color }}>
        {style.stars}
      </span>
      {showLabel && label && (
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ color: style.color, backgroundColor: style.bg }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
