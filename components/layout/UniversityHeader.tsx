"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function UniversityHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif font-bold text-xl text-[#1F2937]">
            🌾 Molino
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-[#6B7280]">
            <Link href="/#metodologia" className="hover:text-[#1F2937] transition-colors">
              Metodología
            </Link>
            <Link href="/#codigo" className="hover:text-[#1F2937] transition-colors">
              Código
            </Link>
            <Link href="/biblioteca" className="hover:text-[#1F2937] transition-colors">
              Biblioteca
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#6B7280] hidden sm:inline">
            🎓 Universidad Pública
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
