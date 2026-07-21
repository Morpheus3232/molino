export interface UserProfile {
  id?: string;
  name: string;
  birthDate: string;
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
