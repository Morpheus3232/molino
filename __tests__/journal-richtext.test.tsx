import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RichText, { toBlocks } from "@/components/journal/RichText";

describe("RichText del diario", () => {
  it("muestra negrita, cursiva y resaltado", () => {
    const { container } = render(<RichText text={"Hoy **sí** fue *raro* y ==claro==."} />);
    expect(container.querySelector("strong")?.textContent).toBe("sí");
    expect(container.querySelector("em")?.textContent).toBe("raro");
    expect(container.querySelector("mark")?.textContent).toBe("claro");
  });

  it("agrupa las citas y separa párrafos", () => {
    const blocks = toBlocks("uno\ndos\n\n> cita\n> sigue\ntres");
    expect(blocks.map((b) => b.kind)).toEqual(["p", "quote", "p"]);
    render(<RichText text={"> una cita"} />);
    expect(screen.getByText("una cita").closest("blockquote")).not.toBeNull();
  });
});
