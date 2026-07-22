"use client";

const categories = [
  { id: 'countries', label: 'Países', icon: '🌍' },
  { id: 'brands', label: 'Marcas', icon: '🏷️' },
  { id: 'bands', label: 'Bandas', icon: '🎸' },
  { id: 'teams', label: 'Fútbol', icon: '⚽' },
  { id: 'politicians', label: 'Políticos', icon: '🏛️' },
  { id: 'actors', label: 'Actores', icon: '🎬' },
  { id: 'cuisine', label: 'Cocinas', icon: '🍽️' },
  { id: 'cities', label: 'Ciudades', icon: '🏙️' },
  { id: 'celebrities', label: 'Celebridades', icon: '⭐' },
];

export default function CategorySelector({ selected, onSelect }: any) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selected === cat.id ? 'bg-foreground text-background' : 'bg-background text-muted hover:bg-card'
          }`}
        >
          {cat.icon} {cat.label}
        </button>
      ))}
    </div>
  );
}
