/**
 * PostHog — type declarations for window.posthog.
 * Only loaded when NEXT_PUBLIC_POSTHOG_KEY is configured.
 * Used in cookieless_mode: "always" — no identify(), no cookies.
 */
interface PostHogCapture {
  (eventName: string, properties?: Record<string, unknown>): void;
}

interface PostHog {
  capture: PostHogCapture;
  [key: string]: unknown;
}

interface Window {
  posthog?: PostHog;
}
