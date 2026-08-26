import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PersonalSynergySigil from "@/components/ui/PersonalSynergySigil";

describe("PersonalSynergySigil Component", () => {
  it("renders deterministic SVG output for two dates", () => {
    const { container } = render(
      <PersonalSynergySigil dateA="1990-03-15" dateB="1988-07-22" nameA="Ana" nameB="Lucas" />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 640 640");

    // Must render paths for both seals A and B
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(10);

    // Must contain the minimal legend
    expect(container.textContent).toContain("Afinidad");
    expect(container.textContent).toContain("Tensión");
    expect(container.textContent).toContain("Resonancia");
  });

  it("is deterministic: same dates yield exact same SVG markup", () => {
    const { container: container1 } = render(
      <PersonalSynergySigil dateA="1995-11-03" dateB="1993-02-14" />
    );
    const { container: container2 } = render(
      <PersonalSynergySigil dateA="1995-11-03" dateB="1993-02-14" />
    );

    expect(container1.innerHTML).toEqual(container2.innerHTML);
  });

  it("produces different geometry for different couples", () => {
    const { container: container1 } = render(
      <PersonalSynergySigil dateA="1990-01-01" dateB="1992-02-02" />
    );
    const { container: container2 } = render(
      <PersonalSynergySigil dateA="1980-08-18" dateB="1985-12-25" />
    );

    expect(container1.innerHTML).not.toEqual(container2.innerHTML);
  });

  it("handles fallback gracefully when dates are missing", () => {
    const { container } = render(
      <PersonalSynergySigil dateA="" dateB="" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
  });
});
