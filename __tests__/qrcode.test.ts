import { describe, it, expect } from "vitest";
import { generateQrMatrix, qrMatrixToSvgPath } from "@/lib/utils/qrcode";
import { getMoonSign, getMoonSignInfo } from "@/lib/engines/astrologyEngine";

describe("QR Code generator", () => {
  it("generates matrix and SVG path for https://molino.app", () => {
    const url = "https://molino.app";
    const matrix = generateQrMatrix(url);
    expect(matrix.length).toBeGreaterThanOrEqual(21);
    expect(matrix[0].length).toBe(matrix.length);
    // Check finder patterns at top-left
    expect(matrix[0][0]).toBe(true);
    expect(matrix[0][1]).toBe(true);
    expect(matrix[0][6]).toBe(true);
    expect(matrix[1][0]).toBe(true);
    expect(matrix[1][1]).toBe(false);

    const svgPath = qrMatrixToSvgPath(matrix);
    expect(svgPath.length).toBeGreaterThan(50);
    expect(svgPath.startsWith("M")).toBe(true);
  });
});

describe("Moon sign calculator", () => {
  it("computes reasonable moon signs for sample dates", () => {
    const sign1 = getMoonSign("1990-04-18", "12:00");
    expect(typeof sign1).toBe("string");
    expect(sign1.length).toBeGreaterThan(2);

    const info = getMoonSignInfo("1990-04-18");
    expect(info.sign).toBe(sign1);
    expect(["Fuego", "Tierra", "Aire", "Agua"]).toContain(info.element);
  });
});
