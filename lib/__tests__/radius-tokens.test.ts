import { test, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Candado: el radio sale de los 4 tokens de `app/globals.css`
 * (sm/md/lg/xl). `rounded-2xl`/`rounded-3xl` son defaults de Tailwind fuera
 * del sistema; llegaron a 92 usos en 42 archivos antes de migrarlos.
 */

const ROOT = path.resolve(__dirname, "../..");
const PROHIBIDO = /rounded(-[a-z]+)?-(2xl|3xl)\b/;

test("ningún componente usa rounded-2xl / rounded-3xl", () => {
  const violaciones = ["app", "components", "lib"].flatMap((dir) =>
    (fs.readdirSync(path.join(ROOT, dir), { recursive: true }) as string[])
      .filter((f) => /\.(tsx|ts)$/.test(f) && !f.includes("__tests__"))
      .map((f) => path.join(dir, f))
      .filter((f) => PROHIBIDO.test(fs.readFileSync(path.join(ROOT, f), "utf8"))),
  );
  expect(violaciones).toEqual([]);
});
