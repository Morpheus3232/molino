"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function UniversityHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif font-bold text-xl text-foreground tracking-tight">
            🌾 Molino
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-muted" aria-label="Navegación principal">
            <Link href="/" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Discover</Link>
            <Link href="/conocimiento" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Knowledge</Link>
            <Link href="/method" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Method</Link>
            <Link href="/biblioteca" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Library</Link>
            <Link href="/explore" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Code</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted hidden sm:inline">🎓 Universidad Pública</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
