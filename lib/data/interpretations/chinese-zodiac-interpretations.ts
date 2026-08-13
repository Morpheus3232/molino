/**
 * Chinese Zodiac Interpretations — Textual archetypes, traits, and element meanings.
 */

import type { ChineseAnimal, ChineseElement } from "@/lib/data/facts/chinese-zodiac-facts";

export interface AnimalInterpretation {
  animal: ChineseAnimal;
  name: string;
  keywords: string[];
  description: string;
  strengths: string[];
  challenges: string[];
}

export const ANIMAL_INTERPRETATIONS_ES: Readonly<Record<ChineseAnimal, AnimalInterpretation>> = {
  Rata: {
    animal: "Rata",
    name: "La Rata",
    keywords: ["Ingeniosa", "Sociable", "Perspicaz", "Estratégica"],
    description: "Pionera del ciclo lunar, destaca por su agudeza mental, rapidez para detectar oportunidades y encanto social.",
    strengths: ["Astucia", "Adaptabilidad", "Economía", "Carisma"],
    challenges: ["Inquietud", "Crítica excesiva", "Desconfianza"],
  },
  Buey: {
    animal: "Buey",
    name: "El Buey",
    keywords: ["Perseverante", "Confiable", "Metódico", "Firme"],
    description: "Emblema de la tenacidad y la lealtad, avanza sin prisa pero sin pausa construyendo bases inquebrantables.",
    strengths: ["Disciplina", "Paciencia", "Honestidad", "Resistencia"],
    challenges: ["Terquedad", "Intransigencia", "Ritmo lento al cambio"],
  },
  Tigre: {
    animal: "Tigre",
    name: "El Tigre",
    keywords: ["Valiente", "Magnético", "Apasionado", "Independiente"],
    description: "Espíritu libre impulsado por la justicia y el arrojo, defiende sus causas con energía contagiosa.",
    strengths: ["Liderazgo", "Coraje", "Generosidad", "Audacia"],
    challenges: ["Impulsividad", "Rebeldía", "Impredecibilidad"],
  },
  Gato: {
    animal: "Gato", // Conejo/Gato
    name: "El Gato / Conejo",
    keywords: ["Diplomático", "Elegante", "Prudente", "Intuitivo"],
    description: "Amante de la paz y el refinamiento estético, resuelve conflictos mediante la suavidad y el buen juicio.",
    strengths: ["Sensibilidad", "Elegancia", "Cautela", "Empatía"],
    challenges: ["Evitación del conflicto", "Duda", "Apego a la comodidad"],
  },
  Dragón: {
    animal: "Dragón",
    name: "El Dragón",
    keywords: ["Visionario", "Poderoso", "Generoso", "Majestuoso"],
    description: "Símbolo supremo de fortuna y vitalidad cósmica, inspira a su entorno con metas audaces y energía magnética.",
    strengths: ["Carisma", "Entusiasmo", "Autoconfianza", "Generosidad"],
    challenges: ["Exigencia excesiva", "Orgullo", "Falta de paciencia con detalles"],
  },
  Serpiente: {
    animal: "Serpiente",
    name: "La Serpiente",
    keywords: ["Intuitiva", "Sabia", "Elegante", "Misteriosa"],
    description: "Pensadora profunda dotada de intuición certera, actúa con discreción y maestría estratégica.",
    strengths: ["Sabiduría", "Concentración", "Elegancia", "Instinto financiero"],
    challenges: ["Posesividad", "Reserva extrema", "Rencor"],
  },
  Caballo: {
    animal: "Caballo",
    name: "El Caballo",
    keywords: ["Libre", "Enérgico", "Aventurero", "Expresivo"],
    description: "Amante incondicional de los espacios abiertos y el movimiento, contagia entusiasmo y rapidez en cada paso.",
    strengths: ["Vitalidad", "Franqueza", "Independencia", "Versatilidad"],
    challenges: ["Impaciencia", "Inconstancia", "Falta de escucha"],
  },
  Cabra: {
    animal: "Cabra",
    name: "La Cabra",
    keywords: ["Creativa", "Compasiva", "Gentil", "Artística"],
    description: "Alma sensible y empática con don natural para las artes y la creación de armonía comunitaria.",
    strengths: ["Imaginación", "Bondad", "Gusto estético", "Paz"],
    challenges: ["Pesimismo ocasional", "Indecisión", "Dependencia emocional"],
  },
  Mono: {
    animal: "Mono",
    name: "El Mono",
    keywords: ["Ingenioso", "Curioso", "Innovador", "Divertido"],
    description: "Maestro de la resolución creativa de problemas, transforma cualquier obstáculo en una oportunidad lúdica.",
    strengths: ["Inteligencia rápida", "Versatilidad", "Humor", "Eficacia"],
    challenges: ["Inquietud", "Arrogancia", "Falta de perseverancia a largo plazo"],
  },
  Gallo: {
    animal: "Gallo",
    name: "El Gallo",
    keywords: ["Observador", "Preciso", "Valiente", "Organizado"],
    description: "Puntual y detallista, defiende la verdad con franqueza y destaca por su capacidad de orden y lealtad.",
    strengths: ["Claridad", "Perfección técnica", "Honestidad", "Organización"],
    challenges: ["Perfeccionismo rígido", "Crítica directa", "Vanidad"],
  },
  Perro: {
    animal: "Perro",
    name: "El Perro",
    keywords: ["Leal", "Justo", "Protector", "Sincero"],
    description: "Guardián de los vínculos auténticos y la justicia social, inspira confianza incondicional en quienes lo rodean.",
    strengths: ["Fidelidad", "Sentido del deber", "Empatía", "Prudencia"],
    challenges: ["Ansiedad", "Pesimismo", "Dificultad para relajarse"],
  },
  Cerdo: {
    animal: "Cerdo",
    name: "El Cerdo",
    keywords: ["Generoso", "Noble", "Tolerante", "Disfrutador"],
    description: "Corazón abierto que valora la autenticidad y el placer de vivir, brinda apoyo incondicional sin juzgar.",
    strengths: ["Generosidad", "Honradez", "Capacidad de disfrute", "Tolerancia"],
    challenges: ["Ingenuidad", "Excesos", "Dificultad para decir que no"],
  },
};

export const CHINESE_ELEMENT_INTERPRETATIONS_ES: Readonly<Record<ChineseElement, string>> = {
  Metal: "Firmeza, determinación, claridad de propósito y estructura moral.",
  Agua: "Fluidez, intuición, diplomacia y sabiduría emocional profunda.",
  Madera: "Crecimiento continuo, creatividad expansiva, generosidad y visión de futuro.",
  Fuego: "Pasión activa, dinamismo, liderazgo contagioso e innovación audaz.",
  Tierra: "Estabilidad, realismo, confiabilidad y capacidad de nutrir proyectos duraderos.",
};
