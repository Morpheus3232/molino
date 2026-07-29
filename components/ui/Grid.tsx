import React, { forwardRef, type HTMLAttributes, type ReactNode, useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: number;
  columnGap?: string;
  rowGap?: string;
  minColumnWidth?: string;
  animated?: boolean;
}

const DEFAULT_COLUMNS = 3;

export const Masonry = forwardRef<HTMLDivElement, MasonryProps>(
  ({
    children,
    columns = DEFAULT_COLUMNS,
    columnGap = "1.5rem",
    rowGap = "1.5rem",
    minColumnWidth = "280px",
    animated = true,
    className,
    style,
    ...props
  }, ref) => {
    const [layout, setLayout] = useState<number[]>(Array(columns).fill(0));
    const containerRef = useRef<HTMLDivElement>(null);

    const calculateLayout = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const minWidth = parseFloat(minColumnWidth);
      const actualColumns = Math.max(1, Math.min(columns, Math.floor(containerWidth / (minWidth + parseFloat(columnGap)))));

      const gaps = Array(actualColumns).fill(0);
      const childrenArray = Array.from(container.children);

      childrenArray.forEach((child, index) => {
        const minHeightIndex = gaps.indexOf(Math.min(...gaps));
        gaps[minHeightIndex] += (child as HTMLElement).clientHeight + parseFloat(rowGap);
      });

      setLayout(gaps);
    }, [columns, columnGap, rowGap, minColumnWidth]);

    useEffect(() => {
      if (!containerRef.current || !animated) return;

      const observer = new ResizeObserver(() => {
        calculateLayout();
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [animated, columns, calculateLayout]);

    const columnStyles = (index: number) => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: rowGap,
    });

    const renderChildren = () =>
      React.Children.map(children, (child, index) => {
        if (!child) return null;
        return (
          <div key={index} style={columnStyles(index)}>
            {child}
          </div>
        );
      });

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={`masonry ${className || ""}`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            columnGap,
            rowGap,
            ...style,
          }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {renderChildren()}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={`masonry ${className || ""}`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          columnGap,
          rowGap,
          ...style,
        }}
        {...props}
      >
        {renderChildren()}
      </div>
    );
  }
);

Masonry.displayName = "Masonry";

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: number;
  start?: number;
  animated?: boolean;
  delay?: number;
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ children, span = 1, start, animated = true, delay = 0, className, style, ...props }, ref) => {
    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={`grid-item ${className || ""}`}
          style={{
            gridColumn: start ? `span ${span} / ${start + span}` : `span ${span}`,
            ...style,
          } as React.CSSProperties}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={`grid-item ${className || ""}`}
        style={{
          gridColumn: start ? `span ${span} / ${start + span}` : `span ${span}`,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = "GridItem";

export interface AsymmetricGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  template?: string;
  gap?: string;
  animated?: boolean;
}

export const AsymmetricGrid = forwardRef<HTMLDivElement, AsymmetricGridProps>(
  ({ children, template, gap = "1.5rem", animated = true, className, style, ...props }, ref) => {
    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={`asymmetric-grid ${className || ""}`}
          style={{
            display: "grid",
            gridTemplateColumns: template || "repeat(12, 1fr)",
            gap,
            ...style,
          } as React.CSSProperties}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={`asymmetric-grid ${className || ""}`}
        style={{
          display: "grid",
          gridTemplateColumns: template || "repeat(12, 1fr)",
          gap,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AsymmetricGrid.displayName = "AsymmetricGrid";

export interface GoldenCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ratio?: number;
  elevated?: boolean;
  animated?: boolean;
  delay?: number;
}

export const GoldenCard = forwardRef<HTMLDivElement, GoldenCardProps>(
  ({ children, ratio = 1.618, elevated = false, animated = true, delay = 0, className, ...props }, ref) => {
    const cardClasses = `golden-card relative bg-card ${className || ""}`;

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          style={{
            ...props.style,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cardClasses}
        style={{
          ...props.style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GoldenCard.displayName = "GoldenCard";

export const EDITORIAL_TEMPLATES = {
  hero: "repeat(12, 1fr)",
  magazine: "repeat(8, 1fr)",
  editorial: "repeat(16, 1fr)",
  showcase: "repeat(12, 1fr)",
  masonry: "repeat(auto-fill, minmax(280px, 1fr))",
  golden: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
} as const;

export const GAP_SIZES = {
  tight: "0.75rem",
  normal: "1rem",
  comfortable: "1.5rem",
  loose: "2rem",
  editorial: "2.5rem",
} as const;

export function useGridLayout(columns: number = 12, containerWidth?: number) {
  const calculateColumns = (width: number, minWidth: number = 280, gap: number = 24) => {
    return Math.max(1, Math.min(columns, Math.floor((width + gap) / (minWidth + gap))));
  };

  return { calculateColumns };
}