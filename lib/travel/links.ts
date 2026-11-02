/**
 * Enlaces para reservar desde el viaje por tu signo. Funciones puras.
 *
 * - Alojamiento: búsqueda de Booking.com con la ciudad y las fechas de la
 *   estadía. Si está configurado `NEXT_PUBLIC_BOOKING_AID` (el id de afiliado
 *   de Booking), va en el enlace y la UI lo dice: si alguien reserva, molino
 *   cobra una comisión y a la persona no le cuesta más.
 * - Vuelos: búsqueda de Google Flights por texto (no tiene afiliados; está
 *   porque es útil, no porque pague).
 *
 * El enlace nunca lleva nada de la persona: solo ciudad, país y fechas.
 */

export const BOOKING_AID = (process.env.NEXT_PUBLIC_BOOKING_AID || "").trim();

export function hasBookingAffiliate(aid = BOOKING_AID): boolean {
  return /^\d{4,12}$/.test(aid);
}

export function bookingSearchUrl(opts: {
  city: string;
  country: string;
  checkin: string; // YYYY-MM-DD
  checkout: string;
  locale: "es" | "en";
  aid?: string;
}): string {
  const aid = opts.aid ?? BOOKING_AID;
  const p = new URLSearchParams({
    ss: `${opts.city}, ${opts.country}`,
    checkin: opts.checkin,
    checkout: opts.checkout,
    group_adults: "2",
    no_rooms: "1",
    group_children: "0",
    lang: opts.locale === "en" ? "en-gb" : "es",
  });
  if (hasBookingAffiliate(aid)) p.set("aid", aid);
  return `https://www.booking.com/searchresults.html?${p.toString()}`;
}

/** Google Flights entiende la búsqueda en inglés: "Flights from X to Y on 2027-01-05 one way". */
export function flightsSearchUrl(opts: { fromCity: string; toCity: string; date: string; locale: "es" | "en" }): string {
  const p = new URLSearchParams({
    q: `Flights from ${opts.fromCity} to ${opts.toCity} on ${opts.date} one way`,
    hl: opts.locale === "en" ? "en" : "es-419",
  });
  return `https://www.google.com/travel/flights?${p.toString()}`;
}
