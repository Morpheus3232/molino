"use client";

import { useState } from "react";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

interface Source {
  id: string;
  title: string;
  author: string;
  year: string;
  type: "libro" | "articulo" | "video" | "sitio";
  description: string;
  link?: string;
}

const SOURCES: Source[] = [
  {
    id: "gg33",
    title: "GG33 Numerología",
    author: "Gary Grinberg",
    year: "2020",
    type: "sitio",
    description: "Sistema de numerología basado en patrones numéricos y astrología china.",
    link: "https://gg33.com"
  },
  {
    id: "pitagoras",
    title: "Numerología Pitagórica",
    author: "Pitágoras (atribuido)",
    year: "~500 a.C.",
    type: "libro",
    description: "Sistema de numerología occidental que asigna valores numéricos a las letras."
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    author: "Tradicional",
    year: "~2000 a.C.",
    type: "sitio",
    description: "Ciclo de 12 animales y 5 elementos basado en el calendario lunar chino.",
    link: "https://www.chinahighlights.com/travelguide/chinese-zodiac/"
  },
  {
    id: "astrologia",
    title: "Astrología Tropical",
    author: "Tradicional",
    year: "~300 a.C.",
    type: "libro",
    description: "Sistema de 12 signos basados en la posición del sol en el zodíaco."
  }
];

export default function BibliotecaPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("todos");

  const filtered = SOURCES.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                         s.author.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todos" || s.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <UniversityHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-semibold text-[#1F2937] mb-4">
            📚 Biblioteca Pública
          </h1>
          <p className="text-[#6B7280] mb-8">
            Fuentes, referencias y materiales educativos que nutren el conocimiento de Molino.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#D4A843]"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#D4A843]"
            >
              <option value="todos">Todos los tipos</option>
              <option value="libro">📖 Libros</option>
              <option value="articulo">📄 Artículos</option>
              <option value="video">🎥 Videos</option>
              <option value="sitio">🌐 Sitios web</option>
            </select>
          </div>

          <div className="space-y-4">
            {filtered.map((source) => (
              <div key={source.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#1F2937]">{source.title}</h3>
                    <p className="text-sm text-[#6B7280]">
                      {source.author} · {source.year}
                    </p>
                  </div>
                  <span className="text-xs bg-[#F8F9FA] px-3 py-1 rounded-full text-[#6B7280]">
                    {source.type === "libro" ? "📖" :
                     source.type === "articulo" ? "📄" :
                     source.type === "video" ? "🎥" : "🌐"}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] mt-2">{source.description}</p>
                {source.link && (
                  <a
                    href={source.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-[#D4A843] hover:underline"
                  >
                    Ver fuente →
                  </a>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#6B7280]">
              <p>No se encontraron fuentes con esos criterios.</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-[#F8F9FA] rounded-2xl border border-gray-100 text-center text-xs text-[#6B7280]">
            <p>
              📢 ¿Conoces una fuente que debería estar aquí? 
              <a href="#" className="text-[#1F2937] underline ml-1">Contribuye en GitHub</a>
            </p>
          </div>
        </div>
      </div>

      <UniversityFooter />
    </div>
  );
}
