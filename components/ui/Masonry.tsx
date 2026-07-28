"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";

export interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: { base: number; sm: number; md: number; lg: number; xl: number };
  gap?: number;
  animated?: boolean;
  staggerDelay?: number;
}

export const Masonry = forwardRef<HTMLDivElement, MasonryProps>(
  ({ children, columns = { base: 1, sm: 2, md: 2, lg: 3, xl: 4 }, gap = 24, animated = true, staggerDelay = 0.08, className, style, ...props }, ref) => {
    const containerStyle: React.CSSProperties = {
      display: "grid",
      gridTemplateColumns: `repeat(${columns.base}, 1fr)`,
      gap: `${gap}px`,
      ...style,
    };

    const mediaQueries = [
      { minWidth: 640, cols: columns.sm },
      { minWidth: 768, cols: columns.md },
      { minWidth: 1024, cols: columns.lg },
      { minWidth: 1280, cols: columns.xl },
    ];

    const renderContent = (ColumnComponent: React.ElementType) =>
      typeof children === "function" ? (children as (args: { ColumnComponent: React.ElementType }) => ReactNode)({ ColumnComponent }) : children;

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={className}
          style={containerStyle}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: staggerDelay },
            },
          }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {renderContent(motion.div)}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={className} style={containerStyle} {...props}>
        {renderContent("div")}
      </div>
    );
  }
);

Masonry.displayName = "Masonry";

export interface MasonryItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  span?: number;
  animated?: boolean;
}

export const MasonryItem = forwardRef<HTMLDivElement, MasonryItemProps>(
  ({ children, span = 1, animated = true, className, ...props }, ref) => {
    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={className}
          style={{ gridColumn: `span ${span}` } as React.CSSProperties}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={className}
        style={{ gridColumn: `span ${span}` } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MasonryItem.displayName = "MasonryItem";

export interface CSSColumnsMasonryProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  minColumnWidth?: number;
  gap?: number;
  breakpoints?: { minWidth: number; columns: number }[];
}

export const CSSColumnsMasonry = forwardRef<HTMLDivElement, CSSColumnsMasonryProps>(
  ({ children, minColumnWidth = 320, gap = 24, breakpoints = [], className, ...props }, ref) => {
    const columnStyle: React.CSSProperties = {
      columnWidth: `${minColumnWidth}px`,
      columnGap: `${gap}px`,
      columnFill: "auto",
    };

    const mediaStyles = breakpoints.map((bp) => ({
      [`@media (min-width: ${bp.minWidth}px)`]: {
        columnWidth: `${bp.minWidth / bp.columns}px`,
      },
    }));

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...containerStyle,
          ...Object.assign({}, ...mediaStyles),
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CSSColumnsMasonry.displayName = "CSSColumnsMasonry";

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

export interface MasonryCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  breakInside?: "avoid" | "auto";
  animated?: boolean;
}

export const MasonryCard = forwardRef<HTMLDivElement, MasonryCardProps>(
  ({ children, breakInside = "avoid", animated = true, className, ...props }, ref) => {
    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={className}
          style={{
            breakInside,
            display: "inline-flex",
            flexDirection: "column",
            marginBottom: "24px",
            ...props.style,
          } as React.CSSProperties}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={className}
        style={{
          breakInside,
          display: "inline-flex",
          flexDirection: "column",
          marginBottom: "24px",
          ...props.style,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MasonryCard.displayName = "MasonryCard";