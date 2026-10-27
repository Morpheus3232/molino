import { vi } from "vitest";
import * as React from "react";

// Los tests renderizan componentes sueltos, sin el layout que provee el
// locale. Se simula el español (idioma maestro) y la navegación de next-intl
// cae en next/link / next/navigation, que ya están stubbeados por jsdom.
vi.mock("next-intl", () => ({
  useLocale: () => "es",
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/lib/i18n/navigation", async () => {
  const link = await import("next/link");
  const nav = await import("next/navigation");
  // Algunos tests mockean next/navigation solo en parte: si falta un export,
  // el acceso tira. Se resuelve al usarlo, con un valor neutro de respaldo.
  const pick = <F,>(name: string, fallback: F): F => {
    try {
      return ((nav as Record<string, unknown>)[name] as F) ?? fallback;
    } catch {
      return fallback;
    }
  };
  return {
    Link: link.default,
    usePathname: () => pick<() => string>("usePathname", () => "/")(),
    useRouter: () => pick<() => unknown>("useRouter", () => ({ push() {}, replace() {}, back() {}, refresh() {}, prefetch() {} }))(),
    redirect: (...a: unknown[]) => pick<(...x: unknown[]) => never>("redirect", () => { throw new Error("redirect"); })(...a),
    permanentRedirect: (...a: unknown[]) => pick<(...x: unknown[]) => never>("permanentRedirect", () => { throw new Error("redirect"); })(...a),
    getPathname: ({ href }: { href: string }) => href,
  };
});
