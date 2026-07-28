"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ className = "", width, height, rounded = false }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--skeleton)] ${rounded ? "rounded-lg" : ""} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
      <Skeleton height="2rem" width="40%" rounded />
      <Skeleton height="1rem" width="80%" />
      <Skeleton height="0.75rem" width="60%" />
      <Skeleton height="2.5rem" width="100%" className="mt-4" />
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <Skeleton height="1rem" width="15%" className="mb-5" rounded />
        <Skeleton height="3.5rem" width="60%" className="mb-4" rounded />
        <Skeleton height="1rem" width="45%" className="mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" key={count}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}