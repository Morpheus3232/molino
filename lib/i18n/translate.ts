/**
 * Traducción de contenido que NO vive en los componentes: los textos que
 * producen los motores (energía del día, lecturas, compatibilidades) y los
 * datos (nombres de signos, animales, elementos, artículos). Se traducen al
 * momento de mostrarlos, nunca antes: los valores en español siguen siendo
 * las claves con las que trabaja la lógica ("Caballo", "Fuego"…).
 *
 * El diccionario es español → inglés, por frase exacta. Una clave puede
 * llevar comodines `{}` para frases con partes variables ("Día {}: {}"):
 * cada parte capturada se vuelve a traducir.
 */
export type ContentDict = Record<string, string>;

export interface Translator {
  /** Traduce un valor para mostrarlo. Lo que no está en el diccionario sale igual. */
  t<V>(value: V): V;
  /** Igual que `t`, pero recorre objetos y arrays (para pasar datos ya traducidos). */
  tx<V>(value: V): V;
}

interface Compiled {
  exact: Map<string, string>;
  lower: Map<string, string>;
  patterns: { re: RegExp; out: string }[];
}

const cache = new WeakMap<ContentDict, Compiled>();

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compile(dict: ContentDict): Compiled {
  const hit = cache.get(dict);
  if (hit) return hit;
  const exact = new Map<string, string>();
  const lower = new Map<string, string>();
  const patterns: Compiled["patterns"] = [];
  for (const [es, en] of Object.entries(dict)) {
    if (es.includes("{}")) {
      const re = new RegExp("^" + es.split("{}").map(escapeRe).join("([\\s\\S]+?)") + "$");
      patterns.push({ re, out: en });
    } else {
      exact.set(es, en);
      lower.set(es.toLowerCase(), en);
    }
  }
  // Los patrones más largos (más específicos) primero.
  patterns.sort((a, b) => b.re.source.length - a.re.source.length);
  const compiled = { exact, lower, patterns };
  cache.set(dict, compiled);
  return compiled;
}

const IDENTITY: Translator = { t: (v) => v, tx: (v) => v };

export function makeTranslator(dict: ContentDict | null | undefined): Translator {
  if (!dict) return IDENTITY;
  const { exact, lower, patterns } = compile(dict);
  // Los componentes a veces muestran el texto con otra caja ("cooperación"
  // en minúscula a mitad de frase): se busca sin distinguir mayúsculas y se
  // devuelve con la misma forma que llegó.
  const recase = (input: string, en: string) => {
    if (input === input.toLowerCase()) return en.toLowerCase();
    if (input === input.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(input)) return en.toUpperCase();
    const first = input.trimStart()[0];
    if (first && first === first.toLowerCase() && first !== first.toUpperCase()) {
      const i = en.search(/\S/);
      return i < 0 ? en : en.slice(0, i) + en[i].toLowerCase() + en.slice(i + 1);
    }
    return en;
  };
  const str = (s: string, depth = 0): string => {
    const direct = exact.get(s);
    if (direct !== undefined) return direct;
    const trimmed = s.trim();
    if (trimmed !== s) {
      const tt = exact.get(trimmed);
      if (tt !== undefined) return s.replace(trimmed, tt);
    }
    const ci = lower.get(trimmed.toLowerCase());
    if (ci !== undefined) return s.replace(trimmed, recase(trimmed, ci));
    if (depth > 3 || !/[A-Za-zÀ-ÿ]/.test(s)) return s;
    for (const p of patterns) {
      const m = p.re.exec(s);
      if (m) {
        let i = 1;
        return p.out.replace(/\{\}/g, () => str(m[i++] ?? "", depth + 1));
      }
    }
    return s;
  };
  const t = <V,>(v: V): V => {
    if (typeof v === "string") return str(v) as V;
    if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? str(x) : x)) as V;
    return v;
  };
  const tx = <V,>(v: V): V => {
    if (typeof v === "string") return str(v) as V;
    if (Array.isArray(v)) return v.map(tx) as V;
    if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype) {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) out[k] = tx(val);
      return out as V;
    }
    return v;
  };
  return { t, tx };
}
