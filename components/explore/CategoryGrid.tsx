"use client";

const categories = [
  { id: "country", label: "Países", icon: "🌍", color: "#D4A843" },
  { id: "city", label: "Ciudades", icon: "🏙️", color: "#4A5568" },
  { id: "brand", label: "Marcas", icon: "🏷️", color: "#6B4C7A" },
  { id: "band", label: "Bandas", icon: "🎸", color: "#C44536" },
  { id: "movie", label: "Películas", icon: "🎬", color: "#2E5C8A" },
  { id: "book", label: "Libros", icon: "📚", color: "#2D5A3D" },
  { id: "philosophy", label: "Filósofos", icon: "🧠", color: "#8B5CF6" },
  { id: "historicalEvent", label: "Eventos", icon: "📜", color: "#B8860B" },
  { id: "food", label: "Comidas", icon: "🍽️", color: "#FF8C42" },
  { id: "color", label: "Colores", icon: "🎨", color: "#E8B4B8" },
  { id: "crystal", label: "Cristales", icon: "💎", color: "#4FD1C5" },
  { id: "deity", label: "Deidades", icon: "✨", color: "#F6AD55" },
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
              background: active ? "#1F2937" : "#FFFFFF",
              color: active ? "#FFFFFF" : "#1F2937",
              borderColor: active ? cat.color : "#E5E7EB",
            }}
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-xs mt-1 font-medium" style={{ color: active ? "#FFFFFF" : "#6B7280" }}>
              {cat.label}
            </span>
            <span className="mt-1 h-1 w-6 rounded-full" style={{ background: cat.color }} />
          </button>
        );
      })}
    </div>
  );
}

export { categories };
