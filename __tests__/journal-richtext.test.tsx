import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RichText from "@/components/journal/RichText";

describe("RichText del diario", () => {
  it("muestra negrita, cursiva y resaltado", () => {
    const { container } = render(<RichText text={"Hoy **sí** fue *raro* y ==claro==."} />);
    expect(container.querySelector("strong")?.textContent).toBe("sí");
    expect(container.querySelector("em")?.textContent).toBe("raro");
    expect(container.querySelector("mark")?.textContent).toBe("claro");
  });

  it("muestra citas y listas", () => {
    const { container } = render(<RichText text={"> una cita\n\n- uno\n- dos"} />);
    expect(screen.getByText("una cita").closest("blockquote")).not.toBeNull();
    expect(container.querySelectorAll("ul li")).toHaveLength(2);
  });
});
