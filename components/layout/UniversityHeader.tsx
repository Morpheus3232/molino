"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function UniversityHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif font-bold text-xl text-foreground">
            🌾 Molino
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-muted" aria-label="Navegación principal">
            <Link href="/conocimiento" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent">
              Conocimiento
            </Link>
            <Link href="/#metodologia" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent">
              Metodología
            </Link>
            <Link href="/#codigo" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent">
              Código
            </Link>
            <Link href="/biblioteca" className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-accent">
              Biblioteca
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted hidden sm:inline">
            🎓 Universidad Pública
          </span>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-full p-2 text-muted hover:text-foreground transition-colors"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur-sm" aria-label="Menú móvil">
          <div className="px-4 py-3 space-y-2">
            <Link href="/conocimiento" className="block py-2 text-sm text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>Conocimiento</Link>
            <Link href="/#metodologia" className="block py-2 text-sm text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>Metodología</Link>
            <Link href="/#codigo" className="block py-2 text-sm text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>Código</Link>
            <Link href="/biblioteca" className="block py-2 text-sm text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>Biblioteca</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
