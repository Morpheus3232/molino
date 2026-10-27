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
  return {
    Link: link.default,
    usePathname: nav.usePathname,
    useRouter: nav.useRouter,
    redirect: nav.redirect,
    getPathname: ({ href }: { href: string }) => href,
  };
});
