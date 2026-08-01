"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AlignmentPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile");
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
        <p className="sr-only" role="status" aria-label="Redirigiendo...">
          Redirigiendo...
        </p>
        <div className="animate-pulse">
          <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
          <div className="h-8 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
          <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
          <div className="h-64 bg-[var(--skeleton)] rounded-md border border-ink/10" />
        </div>
      </div>
    </div>
  );
}
