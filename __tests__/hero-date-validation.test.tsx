import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Hero from "@/components/sections/Hero";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

if (typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
if (typeof (global as unknown as { IntersectionObserver?: unknown }).IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
}
// DateInput calls scrollIntoView to keep the active field visible above the
// mobile keyboard — jsdom doesn't implement layout, so this is a no-op here.
if (typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = () => {};
}

describe("Hero — birth date entry", () => {
  beforeEach(() => {
    push.mockClear();
    localStorage.clear();
  });

  it("valid date: navigates to /onboarding and saves the date", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    await user.type(screen.getByPlaceholderText("DD"), "15");
    await user.type(screen.getByPlaceholderText("MM"), "06");
    await user.type(screen.getByPlaceholderText("AAAA"), "1990");
    await user.click(screen.getByRole("button", { name: /descubrí tu mapa/i }));

    expect(push).toHaveBeenCalledWith("/onboarding");
    const saved = JSON.parse(localStorage.getItem("molino.onboarding.v1") || "{}");
    expect(saved.dateValue).toBe("1990-06-15");
  });

  it("incomplete date: reports the missing field and does not navigate", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    // Day and month only — year left empty.
    await user.type(screen.getByPlaceholderText("DD"), "15");
    await user.type(screen.getByPlaceholderText("MM"), "06");
    await user.click(screen.getByRole("button", { name: /descubrí tu mapa/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Completá el año de nacimiento.");
    expect(push).not.toHaveBeenCalled();
  });

  it("future year: never completes, so the button reports it instead of navigating", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    await user.type(screen.getByPlaceholderText("DD"), "15");
    await user.type(screen.getByPlaceholderText("MM"), "06");
    await user.type(screen.getByPlaceholderText("AAAA"), "2099");
    await user.click(screen.getByRole("button", { name: /descubrí tu mapa/i }));

    expect(push).not.toHaveBeenCalled();
  });
});
