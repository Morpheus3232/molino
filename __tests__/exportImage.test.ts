import { describe, it, expect } from "vitest";
import { dataUrlToBlob, exportDimensions } from "@/lib/utils/exportImage";

describe("dataUrlToBlob", () => {
  // No usa fetch() a propósito: el CSP connect-src (next.config.js) no
  // permite el esquema "data:", así que fetch(dataUrl) tira "Failed to
  // fetch" en Chrome real aunque la conversión nunca sale del navegador.
  it("decodifica una data URL base64 al Blob correcto, sin red", () => {
    const original = "hola molino";
    const base64 = btoa(original);
    const blob = dataUrlToBlob(`data:text/plain;base64,${base64}`);
    expect(blob.type).toBe("text/plain");
    expect(blob.size).toBe(original.length);
  });

  it("usa image/png por defecto si el header no matchea un mime type", () => {
    const blob = dataUrlToBlob(`data:,${btoa("x")}`);
    expect(blob.type).toBe("image/png");
  });
});

describe("exportDimensions", () => {
  it("incluye el formato story (1080x1920) agregado para la variante Tensión", () => {
    expect(exportDimensions("story")).toEqual({ width: 1080, height: 1920, pixelRatio: 2 });
  });

  it("square y og no cambiaron", () => {
    expect(exportDimensions("square")).toEqual({ width: 1080, height: 1080, pixelRatio: 2 });
    expect(exportDimensions("og")).toEqual({ width: 1200, height: 630, pixelRatio: 2 });
  });
});
