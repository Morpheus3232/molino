import { describe, it, expect } from "vitest";
import { toggleWrap, toggleQuote, clearFormat, insertAt } from "@/lib/journal/format";

describe("formato del diario", () => {
  it("envuelve y desenvuelve en negrita", () => {
    const a = toggleWrap("hoy fue raro", 4, 7, "**");
    expect(a.value).toBe("hoy **fue** raro");
    expect(a.value.slice(a.start, a.end)).toBe("fue");
    const b = toggleWrap(a.value, a.start, a.end, "**");
    expect(b.value).toBe("hoy fue raro");
  });

  it("quita la marca si la selección ya la incluye", () => {
    expect(toggleWrap("hoy ==fue== raro", 4, 11, "==").value).toBe("hoy fue raro");
  });

  it("deja afuera los espacios de los bordes", () => {
    expect(toggleWrap("hoy fue raro", 3, 8, "*").value).toBe("hoy *fue* raro");
  });

  it("la cursiva no confunde una negrita", () => {
    expect(toggleWrap("a **b** c", 4, 5, "*").value).toBe("a ***b*** c");
  });

  it("cita y descita las líneas tocadas", () => {
    const q = toggleQuote("uno\ndos\ntres", 5, 9);
    expect(q.value).toBe("uno\n> dos\n> tres");
    expect(toggleQuote(q.value, 6, 8).value).toBe("uno\ndos\n> tres");
  });

  it("limpia el formato", () => {
    expect(clearFormat("**a** y ==b==", 0, 13).value).toBe("a y b");
  });

  it("inserta en el cursor con un corte de párrafo", () => {
    expect(insertAt("", 0, "¿Qué?").value).toBe("¿Qué? ");
    expect(insertAt("Hola", 4, "¿Qué?").value).toBe("Hola\n\n¿Qué? ");
  });
});
