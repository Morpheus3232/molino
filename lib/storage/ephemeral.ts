export interface EphemeralSession {
  name: string;
  birthDate: string;
  timestamp: number;
}

let session: EphemeralSession | null = null;

export function saveSession(data: { name: string; birthDate: string }): void {
  session = {
    name: data.name,
    birthDate: data.birthDate,
    timestamp: Date.now()
  };
}

export function getSession(): EphemeralSession | null {
  return session;
}

export function clearSession(): void {
  session = null;
}

export function isSessionValid(): boolean {
  if (!session) return false;
  const age = Date.now() - session.timestamp;
  return age < 30 * 60 * 1000;
}
