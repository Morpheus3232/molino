export interface User {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  savedComparisons: string[];
  savedEntities: string[];
}

export interface AuthSession {
  user: User;
  token: string;
}

const STORAGE_KEY = 'molino_auth_session';
const USERS_KEY = 'molino_users';

function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function getStoredUsers(): Record<string, { user: User; password: string }> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, { user: User; password: string }>;
  } catch {
    return {};
  }
}

function setStoredUsers(users: Record<string, { user: User; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setStoredSession(session: AuthSession | null) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export async function loginUser(email: string, password: string): Promise<AuthSession | null> {
  const users = getStoredUsers();
  const entry = users[email.toLowerCase()];
  if (!entry || entry.password !== password) {
    return null;
  }
  const session: AuthSession = {
    user: entry.user,
    token: btoa(`${entry.user.id}:${Date.now()}`),
  };
  setStoredSession(session);
  return session;
}

export async function registerUser(name: string, email: string, birthDate: string, password: string): Promise<User> {
  const users = getStoredUsers();
  const key = email.toLowerCase();
  if (users[key]) {
    throw new Error('Email already registered');
  }
  const user: User = {
    id: `user_${Date.now()}`,
    name,
    email: key,
    birthDate,
    savedComparisons: [],
    savedEntities: [],
  };
  users[key] = { user, password };
  setStoredUsers(users);
  const session: AuthSession = {
    user,
    token: btoa(`${user.id}:${Date.now()}`),
  };
  setStoredSession(session);
  return user;
}

export async function getSession(): Promise<AuthSession | null> {
  return getStoredSession();
}

export async function logoutUser(): Promise<void> {
  setStoredSession(null);
}

export async function saveComparison(userId: string, entityId: string): Promise<void> {
  const users = getStoredUsers();
  for (const key of Object.keys(users)) {
    if (users[key].user.id === userId) {
      const user = users[key].user;
      if (!user.savedComparisons.includes(entityId)) {
        user.savedComparisons = [...user.savedComparisons, entityId];
        users[key].user = user;
        setStoredUsers(users);
        const session = getStoredSession();
        if (session && session.user.id === userId) {
          setStoredSession({ ...session, user });
        }
      }
      return;
    }
  }
}

export async function removeComparison(userId: string, entityId: string): Promise<void> {
  const users = getStoredUsers();
  for (const key of Object.keys(users)) {
    if (users[key].user.id === userId) {
      const user = users[key].user;
      user.savedComparisons = user.savedComparisons.filter(id => id !== entityId);
      users[key].user = user;
      setStoredUsers(users);
      const session = getStoredSession();
      if (session && session.user.id === userId) {
        setStoredSession({ ...session, user });
      }
      return;
    }
  }
}

export async function saveEntity(userId: string, entityId: string): Promise<void> {
  const users = getStoredUsers();
  for (const key of Object.keys(users)) {
    if (users[key].user.id === userId) {
      const user = users[key].user;
      if (!user.savedEntities.includes(entityId)) {
        user.savedEntities = [...user.savedEntities, entityId];
        users[key].user = user;
        setStoredUsers(users);
        const session = getStoredSession();
        if (session && session.user.id === userId) {
          setStoredSession({ ...session, user });
        }
      }
      return;
    }
  }
}

export async function removeEntity(userId: string, entityId: string): Promise<void> {
  const users = getStoredUsers();
  for (const key of Object.keys(users)) {
    if (users[key].user.id === userId) {
      const user = users[key].user;
      user.savedEntities = user.savedEntities.filter(id => id !== entityId);
      users[key].user = user;
      setStoredUsers(users);
      const session = getStoredSession();
      if (session && session.user.id === userId) {
        setStoredSession({ ...session, user });
      }
      return;
    }
  }
}
