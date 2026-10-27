import { getRequestConfig } from "next-intl/server";
import { routing, isSiteLocale } from "./routing";

// Molino no usa los mensajes de next-intl (el copy vive en lib/i18n/dictionaries
// y en los pares es/en de `useL`): next-intl solo resuelve el locale.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isSiteLocale(requested) ? requested : routing.defaultLocale;
  return { locale, messages: {} };
});
