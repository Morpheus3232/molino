/**
 * Pure TypeScript QR Code generator (Byte Mode, ECC-M)
 * Lightweight, zero-dependency, works on client and server.
 */

// GF(256) log and exp tables for Galois Field arithmetic
const EXP: number[] = new Array(512);
const LOG: number[] = new Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    EXP[i + 255] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
  LOG[0] = 0;
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

function rsGeneratorPoly(degree: number): number[] {
  let g = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      next[j] ^= gfMul(g[j], EXP[i]);
      next[j + 1] ^= g[j];
    }
    g = next;
  }
  return g;
}

function rsEncode(data: number[], numEcc: number): number[] {
  const gen = rsGeneratorPoly(numEcc);
  const remainder = new Array(numEcc).fill(0);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    if (factor !== 0) {
      for (let j = 0; j < numEcc; j++) {
        remainder[j] ^= gfMul(gen[j + 1], factor);
      }
    }
  }
  return remainder;
}

interface QRVersionInfo {
  version: number;
  totalBytes: number;
  dataBytes: number;
  eccBytes: number;
  alignmentPattern: number[];
}

// Support Versions 1 to 4 with ECC-M
const VERSIONS: QRVersionInfo[] = [
  { version: 1, totalBytes: 26, dataBytes: 16, eccBytes: 10, alignmentPattern: [] },
  { version: 2, totalBytes: 44, dataBytes: 28, eccBytes: 16, alignmentPattern: [6, 18] },
  { version: 3, totalBytes: 70, dataBytes: 44, eccBytes: 26, alignmentPattern: [6, 22] },
  { version: 4, totalBytes: 100, dataBytes: 64, eccBytes: 36, alignmentPattern: [6, 26] },
];

export function generateQrMatrix(text: string): boolean[][] {
  const encoder = new TextEncoder();
  const rawBytes = Array.from(encoder.encode(text));

  // Choose smallest version that fits
  let versionInfo = VERSIONS.find((v) => rawBytes.length + 2 <= v.dataBytes);
  if (!versionInfo) {
    versionInfo = VERSIONS[VERSIONS.length - 1];
  }

  const { version, dataBytes, eccBytes, alignmentPattern } = versionInfo;
  const size = version * 4 + 17;

  // Build bit buffer (Byte mode: indicator 0100)
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  pushBits(0b0100, 4); // Byte mode indicator
  pushBits(rawBytes.length, 8); // 8-bit length for versions 1-9
  for (const b of rawBytes) {
    pushBits(b, 8);
  }

  // Terminator
  const maxBits = dataBytes * 8;
  const terminatorLen = Math.min(4, maxBits - bits.length);
  pushBits(0, terminatorLen);

  // Pad to byte boundary
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  // Pad bytes
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bits to data codewords
  const dataCodewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byteVal = 0;
    for (let j = 0; j < 8; j++) {
      byteVal = (byteVal << 1) | bits[i + j];
    }
    dataCodewords.push(byteVal);
  }

  // ECC codewords
  const eccCodewords = rsEncode(dataCodewords, eccBytes);
  const allCodewords = [...dataCodewords, ...eccCodewords];

  // Initialize matrix: null = unassigned, true = black, false = white
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    new Array(size).fill(null)
  );
  const isFunction: boolean[][] = Array.from({ length: size }, () =>
    new Array(size).fill(false)
  );

  const setModule = (r: number, c: number, val: boolean) => {
    matrix[r][c] = val;
    isFunction[r][c] = true;
  };

  // 1. Finder patterns (7x7) + Separators
  const placeFinder = (startR: number, startC: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = startR + r;
        const nc = startC + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (
            r === -1 ||
            r === 7 ||
            c === -1 ||
            c === 7 ||
            (r >= 1 && r <= 5 && (c === 1 || c === 5)) ||
            (c >= 1 && c <= 5 && (r === 1 || r === 5))
          ) {
            setModule(nr, nc, false);
          } else {
            setModule(nr, nc, true);
          }
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // 2. Alignment patterns for Version 2+
  if (alignmentPattern.length > 0) {
    const coords = alignmentPattern;
    for (const r of coords) {
      for (const c of coords) {
        // Skip if overlaps finder
        if (
          (r <= 8 && c <= 8) ||
          (r <= 8 && c >= size - 8) ||
          (r >= size - 8 && c <= 8)
        ) {
          continue;
        }
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBorder = Math.max(Math.abs(dr), Math.abs(dc)) === 2;
            const isCenter = dr === 0 && dc === 0;
            setModule(r + dr, c + dc, isBorder || isCenter);
          }
        }
      }
    }
  }

  // 3. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) setModule(6, i, i % 2 === 0);
    if (matrix[i][6] === null) setModule(i, 6, i % 2 === 0);
  }

  // Dark module
  setModule(size - 8, 8, true);

  // 4. Reserve Format Info area
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) isFunction[8][i] = true;
    if (matrix[i][8] === null) isFunction[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    if (matrix[8][size - 1 - i] === null) isFunction[8][size - 1 - i] = true;
    if (matrix[size - 1 - i][8] === null) isFunction[size - 1 - i][8] = true;
  }

  // 5. Place Data bits (zigzag)
  let codewordIdx = 0;
  let bitIdx = 7;
  let upwards = true;

  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Skip vertical timing column

    for (let row = 0; row < size; row++) {
      const r = upwards ? size - 1 - row : row;
      for (let c = right; c >= right - 1; c--) {
        if (!isFunction[r][c]) {
          let bit = false;
          if (codewordIdx < allCodewords.length) {
            bit = ((allCodewords[codewordIdx] >> bitIdx) & 1) === 1;
            bitIdx--;
            if (bitIdx < 0) {
              bitIdx = 7;
              codewordIdx++;
            }
          }
          matrix[r][c] = bit;
        }
      }
    }
    upwards = !upwards;
  }

  // 6. Apply Mask Pattern 0: (row + col) % 2 === 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunction[r][c] && (r + c) % 2 === 0) {
        matrix[r][c] = !matrix[r][c];
      }
    }
  }

  // 7. Format Information (ECC Level M = 00, Mask 000 = 000 -> Format Bits = 101010000010010 ^ 101010000010010 = 000000000000000? No, Format info with mask 101010000010010)
  // For ECC M and Mask 0: data 00000 -> 101010000010010
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];

  // Place format info around top-left finder
  setModule(8, 0, formatBits[0] === 1);
  setModule(8, 1, formatBits[1] === 1);
  setModule(8, 2, formatBits[2] === 1);
  setModule(8, 3, formatBits[3] === 1);
  setModule(8, 4, formatBits[4] === 1);
  setModule(8, 5, formatBits[5] === 1);
  setModule(8, 7, formatBits[6] === 1);
  setModule(8, 8, formatBits[7] === 1);
  setModule(7, 8, formatBits[8] === 1);
  setModule(5, 8, formatBits[9] === 1);
  setModule(4, 8, formatBits[10] === 1);
  setModule(3, 8, formatBits[11] === 1);
  setModule(2, 8, formatBits[12] === 1);
  setModule(1, 8, formatBits[13] === 1);
  setModule(0, 8, formatBits[14] === 1);

  // Place format info at right-top and left-bottom
  for (let i = 0; i < 8; i++) {
    setModule(8, size - 1 - i, formatBits[i] === 1);
  }
  for (let i = 0; i < 7; i++) {
    setModule(size - 7 + i, 8, formatBits[8 + i] === 1);
  }

  return matrix.map((row) => row.map((cell) => cell === true));
}

/**
 * Generates an SVG path data string for a QR code matrix.
 */
export function qrMatrixToSvgPath(matrix: boolean[][]): string {
  const size = matrix.length;
  let path = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        path += `M${c},${r}h1v1h-1z `;
      }
    }
  }
  return path.trim();
}
