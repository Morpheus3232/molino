"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Heart } from "lucide-react";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { getCompatibility, ARCHETYPES, SAMPLE_RELATIONS } from "@/lib/data";
import CompatibilityRing from "./CompatibilityRing";
import SectionCard from "./SectionCard";
import ModalSheet from "./ModalSheet";

interface Relation {
  name: string;
  day: number;
  month: number;
  year: number;
  lifePath: number;
}

interface RelationsSectionProps {
  userLifePath: number;
}

export default function RelationsSection({ userLifePath }: RelationsSectionProps) {
  const [relations, setRelations] = useState<Relation[]>(
    SAMPLE_RELATIONS.map((r) => ({
      ...r,
      lifePath: calculateLifePath(`${r.year}-${String(r.month).padStart(2, '0')}-${String(r.day).padStart(2, '0')}`),
    }))
  );
  const [selectedRelation, setSelectedRelation] = useState<Relation | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDay, setNewDay] = useState("");
  const [newMonth, setNewMonth] = useState("");
  const [newYear, setNewYear] = useState("");

  const handleAdd = () => {
    const day = parseInt(newDay, 10);
    const month = parseInt(newMonth, 10);
    const year = parseInt(newYear, 10);
    if (!newName || !day || !month || !year) return;

    const lifePath = calculateLifePath(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    setRelations([...relations, { name: newName, day, month, year, lifePath }]);
    setNewName("");
    setNewDay("");
    setNewMonth("");
    setNewYear("");
    setShowAdd(false);
  };

  return (
    <>
      <SectionCard delay={0.2}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-gray-900">Relaciones</h3>
            <p className="text-xs text-gray-500">Explorá la dinámica con otros</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {relations.map((relation, index) => {
            const compat = getCompatibility(userLifePath, relation.lifePath);
            const archetype = ARCHETYPES[relation.lifePath];

            return (
              <motion.button
                key={`${relation.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onClick={() => setSelectedRelation(relation)}
                className="flex w-full items-center gap-4 rounded-xl bg-gray-50 p-3 text-left transition hover:bg-gray-100"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: archetype?.colorLight || "#F3F4F6",
                    color: archetype?.color || "#4A5568",
                  }}
                >
                  {relation.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{relation.name}</p>
                  <p className="text-xs text-gray-500">
                    {archetype?.name || `Camino ${relation.lifePath}`}
                  </p>
                </div>
                <CompatibilityRing score={compat.score} color={archetype?.color} size={56} />
              </motion.button>
            );
          })}
        </div>
      </SectionCard>

      <ModalSheet
        isOpen={!!selectedRelation}
        onClose={() => setSelectedRelation(null)}
        title={selectedRelation?.name}
      >
        {selectedRelation && (() => {
          const compat = getCompatibility(userLifePath, selectedRelation.lifePath);
          const archetype = ARCHETYPES[selectedRelation.lifePath];
          return (
            <div className="space-y-4">
              <div className="flex justify-center">
                <CompatibilityRing
                  score={compat.score}
                  color={archetype?.color}
                  size={100}
                  label="Compatibilidad"
                />
              </div>
              <div className="space-y-3">
                {[
                  { icon: Heart, label: "Amor", text: compat.love },
                  { label: "Trabajo", text: compat.work },
                  { label: "Comunicación", text: compat.communication },
                  { label: "Amistad", text: compat.friendship },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-700 mb-1">Consejo</p>
                <p className="text-sm text-amber-800">{compat.advice}</p>
              </div>
            </div>
          );
        })()}
      </ModalSheet>

      <ModalSheet isOpen={showAdd} onClose={() => setShowAdd(false)} title="Agregar persona">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Día"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-3 text-sm focus:border-gray-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Mes"
              value={newMonth}
              onChange={(e) => setNewMonth(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-3 text-sm focus:border-gray-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Año"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-3 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Explorar compatibilidad
          </button>
        </div>
      </ModalSheet>
    </>
  );
}
