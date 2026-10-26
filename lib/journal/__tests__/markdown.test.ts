import { describe, it, expect } from "vitest";
import { toBlocks, parseInline, markdownToHtml, docToMarkdown, plainText, type PMNode } from "@/lib/journal/markdown";

const t = (text: string, ...marks: string[]): PMNode => ({ type: "text", text, marks: marks.map((m) => ({ type: m })) });
const p = (...content: PMNode[]): PMNode => ({ type: "paragraph", content });

describe("markdown del diario", () => {
  it("lee marcas, incluso anidadas", () => {
    expect(parseInline("a **b** ***c*** ==**d**==")).toEqual([
      { text: "a " },
      { text: "b", bold: true },
      { text: " " },
      { text: "c", bold: true, italic: true },
      { text: " " },
      { text: "d", highlight: true, bold: true },
    ]);
  });

  it("no confunde un asterisco suelto", () => {
    expect(parseInline("5 * 3 = 15")).toEqual([{ text: "5 * 3 = 15" }]);
  });

  it("corta en párrafos, citas y listas", () => {
    expect(toBlocks("uno\ndos\n\n> cita\n> sigue\n\n- a\n- b\n\n1. x\n2. y").map((b) => b.kind)).toEqual(["p", "quote", "ul", "ol"]);
  });

  it("arma el HTML para el editor (y escapa)", () => {
    expect(markdownToHtml("Hola **<vos>**\n\n> cita")).toBe("<p>Hola <strong>&lt;vos&gt;</strong></p><blockquote><p>cita</p></blockquote>");
    expect(markdownToHtml("- a\n- ==b==")).toBe("<ul><li><p>a</p></li><li><p><mark>b</mark></p></li></ul>");
  });

  it("pasa el documento del editor a texto", () => {
    const doc: PMNode = {
      type: "doc",
      content: [
        p(t("Hoy "), t("sí", "bold"), t(" fue "), t("raro ", "italic"), t("y claro", "highlight")),
        { type: "blockquote", content: [p(t("una cita"))] },
        { type: "bulletList", content: [{ type: "listItem", content: [p(t("uno"))] }, { type: "listItem", content: [p(t("dos"))] }] },
        p(),
      ],
    };
    expect(docToMarkdown(doc)).toBe("Hoy **sí** fue *raro* ==y claro==\n\n> una cita\n\n- uno\n- dos");
  });

  it("va y vuelve: texto → editor → texto", () => {
    const doc: PMNode = { type: "doc", content: [p(t("a "), t("b", "bold", "italic"), t(" "), t("c", "bold", "highlight"))] };
    const md = docToMarkdown(doc);
    expect(md).toBe("a ***b*** ==**c**==");
    expect(markdownToHtml(md)).toBe("<p>a <strong><em>b</em></strong> <mark><strong>c</strong></mark></p>");
  });

  it("junta trozos seguidos con la misma marca", () => {
    expect(docToMarkdown({ type: "doc", content: [p(t("ho", "bold"), t("la", "bold"))] })).toBe("**hola**");
  });

  it("deja el texto limpio para resúmenes", () => {
    const md = "Hoy **sí** fue *raro* y ==claro==.\n\n> Lo que dijo\n\n- uno\n- dos";
    expect(plainText(md)).toBe("Hoy sí fue raro y claro.\n\nLo que dijo\n\nuno\ndos");
  });

  it("una página vieja sin marcas se abre igual", () => {
    expect(markdownToHtml("Línea uno\nLínea dos\n\nOtro párrafo")).toBe("<p>Línea uno<br>Línea dos</p><p>Otro párrafo</p>");
  });
});
