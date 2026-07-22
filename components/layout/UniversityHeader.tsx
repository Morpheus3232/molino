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
            <Link href="/profile" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Mi Mapa</Link>
            <Link href="/timing" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Mi Momento</Link>
            <Link href="/explore" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Mis Conexiones</Link>
            <Link href="/explore" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-full">Explorar</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/onboarding" className="hidden sm:inline-flex items-center justify-center rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
            Descubrir mi Mapa
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
