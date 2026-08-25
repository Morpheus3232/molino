/**
 * ProfileClient — /profile#<hash> persistence.
 *
 * Complements profile-hash-reconstruction.test.ts (which tests the pure
 * encode/decode/rebuild functions in isolation) by testing the two things
 * only ProfileClient does: read window.location.hash on mount to rebuild a
 * profile with no server involved, and write the hash back once a profile
 * is on screen so the address bar becomes a bookmarkable/shareable link.
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ProfileClient from "@/components/profile/ProfileClient";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { encodeProfileData } from "@/lib/utils/profileShare";
import type { UserProfile } from "@/types/user";

vi.mock("@/components/profile/ProfileHub", () => ({
  default: ({ profile }: { profile: UserProfile }) => (
    <div data-testid="profile-hub">{profile.birthDate}</div>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

if (typeof (global as unknown as { IntersectionObserver?: unknown }).IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
}

const PROFILE: UserProfile = {
  ...calculateUserProfile("", "1985-12-25"),
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
  localStorage.clear();
  window.history.replaceState(null, "", "/profile");
});

describe("ProfileClient — reconstructing from an existing hash", () => {
  test("a bare /profile#<hash> visit renders the map with no serverProfile and no localStorage", async () => {
    window.history.replaceState(null, "", `/profile#${encodeProfileData(PROFILE)}`);

    render(<ProfileClient serverProfile={null} />);

    expect(await screen.findByTestId("profile-hub")).toHaveTextContent(PROFILE.birthDate);
  });
});

describe("ProfileClient — writing the hash once a profile is on screen", () => {
  test("a serverProfile-backed visit ends up with that profile encoded in the URL hash", async () => {
    render(<ProfileClient serverProfile={PROFILE} />);

    await screen.findByTestId("profile-hub");
    expect(window.location.hash.slice(1)).toBe(encodeProfileData(PROFILE));
  });
});
