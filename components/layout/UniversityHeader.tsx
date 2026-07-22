import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function UniversityHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg width="28" height="28" viewBox="0 0 64 64" className="shrink-0" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
            <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
          </svg>
          <span className="font-serif font-bold text-xl text-foreground tracking-tight">
            Molino
          </span>
        </Link>
        <nav className="flex items-center gap-3" aria-label="Navegación principal">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
