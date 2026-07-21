export type Goal = "life" | "love" | "career" | "business" | "growth";
export type InterestArea = "relationships" | "career" | "finance" | "health" | "spirituality";

export interface OnboardingData {
  name: string;
  birthDate: string;
  birthCity: string;
  birthCountry: string;
  birthTime: string;
  goal: Goal | null;
  interests: InterestArea[];
}

export const initialOnboardingData: OnboardingData = {
  name: "",
  birthDate: "",
  birthCity: "",
  birthCountry: "",
  birthTime: "",
  goal: null,
  interests: [],
};

export const goalOptions: { value: Goal; label: string; description: string; icon: string }[] = [
  { value: "life", label: "Life", description: "Entender tu propósito y dirección general", icon: "compass" },
  { value: "love", label: "Love", description: "Explorar tus patrones en relaciones afectivas", icon: "heart" },
  { value: "career", label: "Career", description: "Alinear tu trabajo con tu identidad", icon: "briefcase" },
  { value: "business", label: "Business", description: "Timing y decisiones para emprender", icon: "trending-up" },
  { value: "growth", label: "Growth", description: "Desarrollo personal y autoconocimiento", icon: "sprout" },
];

export const interestOptions: { value: InterestArea; label: string }[] = [
  { value: "relationships", label: "Relationships" },
  { value: "career", label: "Career" },
  { value: "finance", label: "Finance" },
  { value: "health", label: "Health" },
  { value: "spirituality", label: "Spirituality" },
];
