import type { BirthDayReduction } from "@/lib/engines/numerologyEngine";

export interface UserProfile {
  id?: string;
  /** Onboarding solo pide birthDate — name no se colecta y no debería exigirse río abajo (perfil, premium, pagos). */
  name?: string;
  birthDate: string;
  birthPlace: string;
  birthTime?: string;
  goal: 'life' | 'love' | 'career' | 'business' | 'growth';
  interests: string[];
  onboardingStep: number;
  completedSections: string[];
  theme: 'light' | 'dark';
  language: 'es' | 'en' | 'pt-BR';
  notifications: boolean;
  // Contexto geográfico "dónde estoy ahora" — separado de birthPlace y del
  // Affinity Score (que sigue siendo 100% animal↔animal). Ver
  // lib/context/userContext.ts. No se pobla por defecto acá; ese módulo
  // es la fuente de verdad, esto es solo el espacio en el tipo.
  country?: string;
  region?: string;
  currency?: string;
  timezone?: string;
  lifePath: number;
  sunSign: string;
  sunSignInfo: {
    sign: string;
    element: string;
    modality: string;
    symbol?: string;
  };
  chineseZodiac: string;
  chineseZodiacInfo: {
    animal: string;
    element: string;
    emoji?: string;
  };
  element: string;
  modality: string;
  luckyNumber: number;
  archetype: string;
  archetypeInfo: any;
  expressionNumber?: number;
  personalityNumber?: number;
  birthDay?: BirthDayReduction;
  cycles: {
    personalYear: number;
    personalMonth: number;
    personalDay: number;
  };
  recommendations: {
    strengths: string[];
    challenges: string[];
    practices: string[];
  };
}
