import { describe, it, expect } from "vitest";
import { bookingSearchUrl, flightsSearchUrl, hasBookingAffiliate } from "../links";

describe("enlaces de viaje", () => {
  it("Booking lleva ciudad, país y fechas; el aid solo si es válido", () => {
    const u = new URL(bookingSearchUrl({ city: "Lima", country: "Perú", checkin: "2027-01-05", checkout: "2027-01-10", locale: "es", aid: "" }));
    expect(u.hostname).toBe("www.booking.com");
    expect(u.searchParams.get("ss")).toBe("Lima, Perú");
    expect(u.searchParams.get("checkin")).toBe("2027-01-05");
    expect(u.searchParams.get("checkout")).toBe("2027-01-10");
    expect(u.searchParams.has("aid")).toBe(false);
    const a = new URL(bookingSearchUrl({ city: "Lima", country: "Peru", checkin: "2027-01-05", checkout: "2027-01-10", locale: "en", aid: "1234567" }));
    expect(a.searchParams.get("aid")).toBe("1234567");
    expect(a.searchParams.get("lang")).toBe("en-gb");
  });
  it("un aid mal cargado no se manda", () => {
    expect(hasBookingAffiliate("abc")).toBe(false);
    expect(hasBookingAffiliate("1234567")).toBe(true);
    const u = new URL(bookingSearchUrl({ city: "X", country: "Y", checkin: "2027-01-05", checkout: "2027-01-06", locale: "es", aid: "x'><" }));
    expect(u.searchParams.has("aid")).toBe(false);
  });
  it("Google Flights con origen, destino y fecha", () => {
    const u = new URL(flightsSearchUrl({ fromCity: "Buenos Aires", toCity: "Lima", date: "2027-01-05", locale: "es" }));
    expect(u.searchParams.get("q")).toBe("Flights from Buenos Aires to Lima on 2027-01-05 one way");
    expect(u.searchParams.get("hl")).toBe("es-419");
  });
});
