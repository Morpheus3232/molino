export interface UserProfile {
  id?: string;
  name: string;
  birthDate: string;
  birthPlace: string;
  birthTime?: string;
  goal: "life" | "love" | "career" | "business" | "growth";
  interests: string[];
  onboardingStep: number;
  completedSections: string[];
  theme: "light" | "dark";
  language: "es" | "en";
  notifications: boolean;
  lifePath: number;
  sunSign: string;
  sunSignInfo: {
    sign: string;
    element: string;
    modality: string;
  };
  chineseZodiac: string;
  chineseZodiacInfo: {
    animal: string;
    element: string;
  };
  element: string;
  modality: string;
  archetype: string;
  archetypeInfo: any;
  expressionNumber?: number;
  soulNumber?: number;
  personalityNumber?: number;
}
