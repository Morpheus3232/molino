/**
 * Browser-based calendar reminder for numerological days.
 * Stores preference in localStorage, uses Notifications API.
 * No account or server required — client-side only.
 */

export interface CalendarReminderPreference {
  birthDate: string; // YYYY-MM-DD
  enabled: boolean;
  notificationPermission: NotificationPermission;
}

const STORAGE_KEY = "molino.calendar-reminder";

/**
 * Save user's reminder preference to localStorage.
 */
export function saveReminderPreference(birthDate: string, enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    const pref: CalendarReminderPreference = {
      birthDate,
      enabled,
      notificationPermission: Notification.permission,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
  } catch (err) {
    console.error("[CalendarReminder] Failed to save preference:", err);
  }
}

/**
 * Load user's reminder preference from localStorage.
 */
export function getReminderPreference(): CalendarReminderPreference | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("[CalendarReminder] Failed to load preference:", err);
    return null;
  }
}

/**
 * Clear reminder preference (opt-out).
 */
export function clearReminderPreference(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("[CalendarReminder] Failed to clear preference:", err);
  }
}

/**
 * Request browser notification permission.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  if (Notification.permission !== "default") {
    return Notification.permission;
  }

  return Notification.requestPermission();
}

/**
 * Send a browser notification.
 */
export function sendNotification(title: string, options?: NotificationOptions): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "molino-reminder",
      requireInteraction: false,
      ...options,
    });
  } catch (err) {
    console.error("[CalendarReminder] Failed to send notification:", err);
  }
}

/**
 * Check if today is a numerologically significant day for the user.
 * Returns the day number (1-9) if significant, null otherwise.
 */
export function getTodayNumerologyDay(birthDate: string): number | null {
  if (!birthDate) return null;

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  // Sum digits: day + month + year
  const sumDigits = (n: number): number => {
    while (n >= 10) {
      n = Math.floor(n / 10) + (n % 10);
    }
    return n;
  };

  const todayNumber = sumDigits(day + month + year);

  // Extract birth day number from birthDate (YYYY-MM-DD format)
  const [, birthMonth, birthDay] = birthDate.split("-").map(Number);
  const birthDayNumber = sumDigits(birthDay + birthMonth);

  // Significant days: personal day or personal year day
  // Personal day: matches birth day
  // Personal year day: matches birth month + today's month
  if (todayNumber === birthDayNumber) {
    return todayNumber;
  }

  return null;
}

/**
 * Check and send reminder if today is significant for the user.
 */
export function checkAndSendReminder(): void {
  if (typeof window === "undefined") return;

  const pref = getReminderPreference();
  if (!pref || !pref.enabled) return;

  const significantDay = getTodayNumerologyDay(pref.birthDate);
  if (significantDay === null) return;

  sendNotification("Tu día numerológico en Molino ✨", {
    body: `Hoy es tu día numerológico ${significantDay}. Explorá tu energía en Molino.`,
    actions: [
      { action: "open", title: "Abrir Molino" },
      { action: "dismiss", title: "Recordar después" },
    ],
  });
}

/**
 * Register service worker for background reminder checks.
 * Call once on app load if reminders are enabled.
 */
export async function registerReminderServiceWorker(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("/reminders-sw.js", {
      scope: "/",
    });
  } catch (err) {
    console.error("[CalendarReminder] Failed to register service worker:", err);
  }
}
