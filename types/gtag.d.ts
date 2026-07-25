/* eslint-disable no-var */

/**
 * Google Analytics 4 — gtag.js type declarations.
 * Only loaded when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.
 */
interface GtagEventParams {
  [key: string]: string | number | boolean | undefined;
}

interface GtagFunction {
  (command: "config", targetId: string, config?: Record<string, unknown>): void;
  (command: "event", eventName: string, params?: GtagEventParams): void;
  (command: "set", targetId: string, config: Record<string, unknown>): void;
}

interface Window {
  gtag?: GtagFunction;
}
