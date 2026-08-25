/**
 * ProfileClient — empty state vs. map rendering.
 *
 * ProfileHub is mocked out: this file is about ProfileClient's own branching
 * (no profile → empty state, profile → map), not ProfileHub's internals,
 * which already have their own coverage elsewhere.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ProfileClient from "@/components/profile/ProfileClient";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import type { UserProfile } from "@/types/user";

vi.mock("@/components/profile/ProfileHub", () => ({
  default: ({ profile }: { profile: UserProfile }) => (
    <div data-testid="profile-hub">{profile.archetype}</div>
  ),
}));

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

if (typeof (global as unknown as { IntersectionObserver?: unknown }).IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
}

const VALID_PROFILE: UserProfile = {
  ...calculateUserProfile("", "1990-03-15"),
  birthPlace: "",
  goal: "life",
  interests: [],
  onboardingStep: 4,
  completedSections: ["identity"],
  theme: "light",
  language: "es",
  notifications: true,
};

beforeEach(() => {
  push.mockClear();
  localStorage.clear();
  window.history.replaceState(null, "", "/profile");
});

describe("ProfileClient — no profile available", () => {
  test("shows the empty state explaining the map is generated on the homepage", async () => {
    render(<ProfileClient serverProfile={null} />);
    expect(await screen.findByRole("heading", { name: /tu mapa se genera en la portada/i })).toBeInTheDocument();
  });

  test("does not render the map", async () => {
    render(<ProfileClient serverProfile={null} />);
    await screen.findByRole("heading", { name: /tu mapa se genera en la portada/i });
    expect(screen.queryByTestId("profile-hub")).not.toBeInTheDocument();
  });

  test("the CTA navigates to the homepage", async () => {
    const user = userEvent.setup();
    render(<ProfileClient serverProfile={null} />);
    const cta = await screen.findByRole("button", { name: /ir a la portada/i });
    await user.click(cta);
    expect(push).toHaveBeenCalledWith("/");
  });
});

describe("ProfileClient — profile available", () => {
  test("renders the map instead of the empty state", async () => {
    render(<ProfileClient serverProfile={VALID_PROFILE} />);
    expect(await screen.findByTestId("profile-hub")).toHaveTextContent(VALID_PROFILE.archetype);
    expect(screen.queryByRole("heading", { name: /tu mapa se genera en la portada/i })).not.toBeInTheDocument();
  });
});
