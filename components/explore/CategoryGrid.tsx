"use client";

const categories = [
  { id: "country", label: "Países", color: "#C49A2A" },
  { id: "city", label: "Ciudades", color: "#4A5568" },
  { id: "brand", label: "Marcas", color: "#6B4C7A" },
  { id: "band", label: "Bandas", color: "#C44536" },
  { id: "movie", label: "Películas", color: "#2E5C8A" },
  { id: "book", label: "Libros", color: "#2D5A3D" },
  { id: "philosophy", label: "Filósofos", color: "#8B5CF6" },
  { id: "historicalEvent", label: "Eventos", color: "#B8860B" },
  { id: "food", label: "Comidas", color: "#FF8C42" },
  { id: "color", label: "Colores", color: "#E8B4B8" },
  { id: "crystal", label: "Cristales", color: "#4FD1C5" },
  { id: "deity", label: "Deidades", color: "#F6AD55" },
];

interface CategoryGridProps {
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function CategoryGrid({ selectedId, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex flex-col items-center p-3 rounded-2xl border transition-all hover:shadow-md"
            style={{
              background: active ? "var(--color-foreground)" : "var(--color-card)",
              color: active ? "var(--color-background)" : "var(--color-foreground)",
              borderColor: active ? cat.color : "var(--color-border)",
            }}
          >
            <span
              className="w-3 h-3 rounded-full mb-2"
              style={{ backgroundColor: cat.color }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium">
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { categories };
