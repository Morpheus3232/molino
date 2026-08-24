/**
 * Compatibility Interpretations — Relational descriptions and narrative templates.
 */

export const RELATION_LABELS_ES: Readonly<Record<string, { label: string; description: string }>> = {
  same: {
    label: "Alta compatibilidad",
    description: "Comparte tu mismo animal del zodíaco chino.",
  },
  triad: {
    label: "Buena compatibilidad",
    description: "Pertenece a uno de tus dos animales aliados.",
  },
  harmonious: {
    label: "Par armonioso",
    description: "Excelente complementariedad y apoyo mutuo. Vínculo fluido y constructivo.",
  },
  neutral: {
    label: "Relación neutral",
    description: "Relación equilibrada sin tensiones ni afinidades predeterminadas. Gran espacio para la construcción mutua.",
  },
  harm: {
    label: "Relación de contraste",
    description: "Ritmos y estilos de procesamiento diferentes. Requiere paciencia y claridad en acuerdos.",
  },
  clash: {
    label: "Energía opuesta",
    description: "Pertenece al animal que ocupa la posición opuesta a la tuya.",
  },
};

export const TIER_DESCRIPTIONS_ES: Readonly<Record<number, string>> = {
  5: "Resonancia excepcional: profunda afinidad en propósito, estilo y ritmo de vida.",
  4: "Alta afinidad: flujo natural de entendimiento y complementariedad en objetivos comunes.",
  3: "Conexión equilibrada: buena base de cooperación con espacio para enriquecerse en las diferencias.",
  2: "Dinámica de contraste: ritmos distintos que exigen comunicación abierta y flexibilidad.",
  1: "Polaridad desafiante: oportunidad de aprendizaje consciente a través del respeto mutuo.",
};
