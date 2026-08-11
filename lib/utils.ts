export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(day: number, month: number, year: number): string {
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${day} de ${months[month - 1]} de ${year}`;
}

export function getDayName(date: Date): string {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[date.getDay()];
}

export function getShortDayName(date: Date): string {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return days[date.getDay()];
}

export interface UserProfile {
  name: string;
  day: number;
  month: number;
  year: number;
  intention: string;
  lifePath: number;
}

const STORAGE_KEY = "molino_profile";

export function saveProfile(profile: UserProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const ENERGY_BARS_MAP: Record<number, Record<string, number>> = {
  1: { Creatividad: 75, Liderazgo: 95, Intuición: 60, Estabilidad: 50, Comunicación: 70, Empatía: 45 },
  2: { Creatividad: 65, Liderazgo: 40, Intuición: 90, Estabilidad: 70, Comunicación: 75, Empatía: 95 },
  3: { Creatividad: 95, Liderazgo: 55, Intuición: 70, Estabilidad: 35, Comunicación: 95, Empatía: 65 },
  4: { Creatividad: 45, Liderazgo: 60, Intuición: 50, Estabilidad: 95, Comunicación: 55, Empatía: 60 },
  5: { Creatividad: 80, Liderazgo: 65, Intuición: 75, Estabilidad: 30, Comunicación: 85, Empatía: 50 },
  6: { Creatividad: 60, Liderazgo: 50, Intuición: 75, Estabilidad: 80, Comunicación: 70, Empatía: 95 },
  7: { Creatividad: 90, Liderazgo: 60, Intuición: 95, Estabilidad: 40, Comunicación: 70, Empatía: 55 },
  8: { Creatividad: 55, Liderazgo: 95, Intuición: 65, Estabilidad: 75, Comunicación: 70, Empatía: 45 },
  9: { Creatividad: 75, Liderazgo: 55, Intuición: 70, Estabilidad: 40, Comunicación: 80, Empatía: 70 },
  11: { Creatividad: 90, Liderazgo: 70, Intuición: 98, Estabilidad: 45, Comunicación: 85, Empatía: 80 },
  22: { Creatividad: 75, Liderazgo: 90, Intuición: 85, Estabilidad: 85, Comunicación: 75, Empatía: 70 },
  33: { Creatividad: 85, Liderazgo: 75, Intuición: 95, Estabilidad: 60, Comunicación: 90, Empatía: 98 },
};

export function getEnergyBars(lifePath: number): Record<string, number> {
  return ENERGY_BARS_MAP[lifePath] || ENERGY_BARS_MAP[7];
}
