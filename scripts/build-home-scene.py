#!/usr/bin/env python3
"""
Arma las capas de la escena de apertura de la portada a partir de la
ilustración licenciada `public/home/quijote-sancho.jpg`.

    python3 scripts/build-home-scene.py

Salida en `public/home/escena/` (WebP con transparencia):

- quijote.webp / sancho.webp  jinetes recortados tal cual están dibujados
- molino.webp                 torre del molino grande, sin aspas (las aspas
                              las dibuja el componente para que puedan girar)
- lomas.webp                  franja repetible de lomas rojas (plano medio)
- sierra.webp                 franja repetible de sierras (plano de fondo)
- suelo.webp                  franja repetible de loma negra con las flores
                              del original (primer plano)

Las tres franjas se repiten en horizontal sin costura: el ancho de cada una
es un período exacto de sus ondas, y la textura se espeja en los bordes.
Todo lo que tiene "grano" lo toma del original: no se inventa textura.

Además imprime las posiciones de los molinos en la franja de lomas (en % del
ancho/alto), que el componente usa para montar torre y aspas encima.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/home/quijote-sancho.jpg"
OUT = ROOT / "public/home/escena"

RED = np.array([233, 58, 55], dtype=float)
INK = np.array([26, 20, 24], dtype=float)


def load() -> np.ndarray:
    return np.asarray(Image.open(SRC).convert("RGB")).astype(float)


def masks(img: np.ndarray):
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    white = img.min(axis=2) > 236
    red = (r > 150) & (r - g > 70) & ~white
    # Los rosados del borde entre rojo y blanco no son tinta.
    lum = img @ np.array([0.3, 0.59, 0.11])
    near_red = ndi.binary_dilation(red, iterations=3)
    dark = ~white & ~red & ~(near_red & (lum > 150))
    return white, red, dark


def alpha_against_white(img: np.ndarray, ink: np.ndarray) -> np.ndarray:
    """Cuánto de `ink` hay en cada píxel, asumiendo que el resto es papel blanco."""
    lum = img @ np.array([0.3, 0.59, 0.11])
    ink_lum = float(ink @ np.array([0.3, 0.59, 0.11]))
    return np.clip((255 - lum) / (255 - ink_lum), 0, 1)


def rgba(img: np.ndarray, solid: np.ndarray, edge_alpha: np.ndarray, ink: np.ndarray) -> np.ndarray:
    """Interior opaco con el color original; borde con alfa y color de tinta pura."""
    a = np.where(solid, 1.0, edge_alpha)
    rgb = np.where(solid[..., None], img, ink[None, None, :])
    out = np.dstack([rgb, a * 255]).clip(0, 255).astype(np.uint8)
    return out


def bbox(mask: np.ndarray, pad: int = 2):
    ys, xs = np.nonzero(mask)
    return (max(xs.min() - pad, 0), max(ys.min() - pad, 0), xs.max() + pad + 1, ys.max() + pad + 1)


def save(arr: np.ndarray, name: str, box=None, quality: int = 86) -> Image.Image:
    im = Image.fromarray(arr, "RGBA")
    if box is not None:
        im = im.crop(box)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / name, "WEBP", quality=quality, method=6)
    print(f"  {name}: {im.width}x{im.height}")
    return im


# ── Loma negra del primer plano ───────────────────────────────────────────


def front_hill(dark: np.ndarray) -> np.ndarray:
    """La loma negra: lo oscuro que sobrevive a una apertura gruesa (las patas
    son finas y desaparecen), rellenada columna por columna para que las
    flores blancas queden adentro."""
    opened = ndi.binary_opening(dark, structure=np.ones((31, 31)))
    lab, n = ndi.label(opened)
    h = dark.shape[0]
    best, best_size = 0, 0
    for i in range(1, n + 1):
        comp = lab == i
        if comp[int(h * 0.9):].any() and comp.sum() > best_size:
            best, best_size = i, comp.sum()
    hill = lab == best
    filled = np.zeros_like(hill)
    cols = np.nonzero(hill.any(axis=0))[0]
    for x in cols:
        ys = np.nonzero(hill[:, x])[0]
        filled[ys.min(): ys.max() + 1, x] = True
    # Recupera el borde que se comió la apertura.
    grown = ndi.binary_dilation(filled, iterations=16) & (dark | ndi.binary_dilation(filled, iterations=2))
    out = np.zeros_like(hill)
    for x in np.nonzero(grown.any(axis=0))[0]:
        ys = np.nonzero(grown[:, x])[0]
        out[ys.min(): ys.max() + 1, x] = True
    return out


# ── Jinetes ───────────────────────────────────────────────────────────────


def riders(img, dark, hill):
    body = dark & ~ndi.binary_dilation(hill, iterations=4)
    body = ndi.binary_closing(body, structure=np.ones((3, 3)))
    lab, n = ndi.label(body)
    keep = np.zeros_like(body)
    for i, (sl, size) in enumerate(zip(ndi.find_objects(lab), ndi.sum(body, lab, range(1, n + 1)))):
        # Solo lo que está arriba de la loma: los restos del borde de la loma
        # (puntas, la franja de flores) quedan abajo y se descartan.
        if size > 4000 and sl[0].start < img.shape[0] * 0.6:
            keep |= lab == i + 1
    # Rellena solo huecos chicos (las líneas blancas del escudo y la manta).
    # Los huecos grandes son cielo entre las riendas y el cuello: van vacíos.
    holes = ndi.binary_fill_holes(keep) & ~keep
    hl, hn = ndi.label(holes)
    hsize = ndi.sum(holes, hl, range(1, hn + 1))
    small = np.isin(hl, [i + 1 for i, s in enumerate(hsize) if s < 900])
    keep = keep | small
    w = img.shape[1]
    split = int(w * 0.505)
    alpha = alpha_against_white(img, INK)
    solid = ndi.binary_erosion(keep, iterations=1)
    edge = ndi.binary_dilation(keep, iterations=2) & ~solid
    result = {}
    for name, part in (("quijote", slice(0, split)), ("sancho", slice(split, w))):
        m = np.zeros_like(keep)
        m[:, part] = keep[:, part]
        s = solid & m
        e = np.zeros_like(edge)
        e[:, part] = edge[:, part]
        e_alpha = np.where(e, alpha, 0)
        arr = rgba(img, s, e_alpha, INK)
        box = bbox(m | e, pad=3)
        result[name] = (arr, box, m)
    return result


def leg_line(mask: np.ndarray, box) -> dict:
    """Dónde terminan los cuerpos y empiezan las patas: la fila (desde arriba)
    en la que el ancho ocupado cae de golpe. Devuelve proporciones del recorte."""
    x0, y0, x1, y1 = box
    sub = mask[y0:y1, x0:x1]
    width = sub.sum(axis=1)
    h = sub.shape[0]
    # Busca en la mitad inferior la primera fila con menos de un 35% del
    # ancho máximo del cuerpo: ahí ya son solo patas.
    lower = range(int(h * 0.55), h)
    body_w = width[int(h * 0.45): int(h * 0.75)].max()
    cut = next((y for y in lower if width[y] < body_w * 0.35), int(h * 0.78))
    cols = np.nonzero(sub[cut:].any(axis=0))[0]
    # Separación entre patas delanteras y traseras: el hueco más ancho.
    gaps = np.diff(cols)
    i = int(np.argmax(gaps))
    split = (cols[i] + cols[i + 1]) / 2
    return {"cut": round(cut / h * 100, 2), "split": round(split / sub.shape[1] * 100, 2)}


# ── Molino ────────────────────────────────────────────────────────────────

# Torre del molino grande (izquierda), en píxeles del original. El techo y el
# cuerpo; las aspas quedan afuera del polígono.
TOWER = [(272, 352), (233, 393), (240, 393), (237, 606), (354, 606), (312, 393), (320, 393)]
TOWER_HUB = (282, 418)  # donde se cruzan las aspas, sobre la torre


def windmill(img, red):
    poly = Image.new("L", (img.shape[1], img.shape[0]), 0)
    ImageDraw.Draw(poly).polygon(TOWER, fill=255)
    inside = np.asarray(poly) > 0
    alpha = np.clip((255 - img[..., 1]) / (255 - RED[1]), 0, 1)
    solid = ndi.binary_erosion(inside & (red | (img.min(axis=2) > 236)), iterations=1) & inside
    # La puerta es blanca y va opaca: es parte de la torre.
    edge = inside & ~solid
    arr = rgba(img, solid, np.where(edge, alpha, 0), RED)
    box = bbox(inside, pad=1)
    return arr, box


# ── Texturas y franjas repetibles ─────────────────────────────────────────


def grain(width: int, height: int, base, speck, density: float, seed: int) -> np.ndarray:
    """Grano de imprenta como el del original: manchitas de otro tono,
    agrupadas en zonas. Ruido con borde envolvente: repite sin costura."""
    rng = np.random.default_rng(seed)
    fine = ndi.gaussian_filter(rng.normal(size=(height, width)), 1.4, mode="wrap")
    zones = ndi.gaussian_filter(rng.normal(size=(height, width)), 38, mode="wrap")
    field = fine / fine.std() + 0.8 * zones / zones.std()
    t = np.quantile(field, 1 - density)
    a = np.clip((field - t) / 0.35, 0, 1)[..., None]
    base = np.asarray(base, dtype=float)[None, None, :]
    speck = np.asarray(speck, dtype=float)[None, None, :]
    return base * (1 - a) + speck * a


def wave(width: int, terms) -> np.ndarray:
    """Suma de senos con un número entero de ciclos por franja: repetible."""
    x = np.arange(width) / width
    y = np.zeros(width)
    for cycles, amp, phase in terms:
        y += amp * np.sin(2 * math.pi * cycles * x + phase)
    return y


def band(texture, top: np.ndarray, height: int, ink, soft=1.5):
    width = top.shape[0]
    yy = np.arange(height)[:, None]
    d = yy - top[None, :]  # >0 adentro
    a = np.clip(d / soft + 0.5, 0, 1)
    rgb = np.where((a > 0.999)[..., None], texture[:height, :width], ink[None, None, :])
    return np.dstack([rgb, a * 255]).clip(0, 255).astype(np.uint8)


def peaks(width: int, height: int, n: int, seed: int) -> np.ndarray:
    """Sierra de picos como la del fondo derecho del original: picos
    redondeados con laderas largas, repetible."""
    rng = np.random.default_rng(seed)
    x = np.arange(width)
    top = np.full(width, float(height))
    for k in range(n):
        cx = (k + rng.uniform(0.2, 0.8)) * width / n
        h = rng.uniform(0.45, 0.95) * height
        spread = rng.uniform(0.07, 0.13) * width
        for off in (-width, 0, width):
            dx = np.abs(x - cx - off) / spread
            prof = height - h * np.exp(-dx ** 1.6)
            top = np.minimum(top, prof)
    return top


# Franja de flores del original: lo blanco entre la loma negra y su borde de
# abajo, de punta a punta. Se pega dos veces (la segunda espejada) para que
# la franja repetible no tenga costura.
FLOWERS_X = (340, 1790)
FLOWERS_TOP = 752


def flower_strip(img, hill, white):
    x0, x1 = FLOWERS_X
    y1 = img.shape[0]
    region = np.zeros_like(white)
    for x in range(x0, x1):
        ys = np.nonzero(hill[:, x])[0]
        if len(ys):
            region[max(FLOWERS_TOP, ys.min() + 4): ys.max() - 5, x] = True
    sub = img[FLOWERS_TOP:y1, x0:x1]
    a = np.clip((sub.min(axis=2) - 70) / (236 - 70), 0, 1) * region[FLOWERS_TOP:y1, x0:x1]
    rows = np.nonzero(a.max(axis=1) > 0.5)[0]
    a = a[: rows.max() + 3]
    return np.dstack([np.full(a.shape + (3,), 255.0), a * 255]).astype(np.uint8)


def paste(dst: np.ndarray, spr: np.ndarray, x: int, y: int):
    """Pega con alfa, dando la vuelta por los bordes horizontales."""
    h, w = spr.shape[:2]
    W = dst.shape[1]
    for off in (0, -W, W):
        xs, xe = x + off, x + off + w
        if xe <= 0 or xs >= W:
            continue
        sx0, sx1 = max(0, -xs), w - max(0, xe - W)
        dx0, dx1 = max(xs, 0), min(xe, W)
        y0, y1 = max(y, 0), min(y + h, dst.shape[0])
        sy0 = y0 - y
        src = spr[sy0: sy0 + (y1 - y0), sx0:sx1].astype(float)
        dd = dst[y0:y1, dx0:dx1].astype(float)
        a = src[..., 3:4] / 255
        dd[..., :3] = src[..., :3] * a + dd[..., :3] * (1 - a)
        dd[..., 3:4] = np.maximum(dd[..., 3:4], src[..., 3:4])
        dst[y0:y1, dx0:dx1] = dd.astype(np.uint8)


def main():
    img = load()
    white, red, dark = masks(img)
    hill = front_hill(dark)

    print("Jinetes")
    meta = {}
    for name, (arr, box, m) in riders(img, dark, hill).items():
        im = save(arr, f"{name}.webp", box, quality=90)
        meta[name] = {"w": im.width, "h": im.height, **leg_line(m, box)}

    print("Molino")
    arr, box = windmill(img, red)
    im = save(arr, "molino.webp", box, quality=90)
    meta["molino"] = {
        "w": im.width,
        "h": im.height,
        "hubX": round((TOWER_HUB[0] - box[0]) / im.width * 100, 2),
        "hubY": round((TOWER_HUB[1] - box[1]) / im.height * 100, 2),
    }

    RED_GRAIN = (231, 114, 75)
    INK_GRAIN = (125, 111, 89)
    strip = flower_strip(img, hill, white)

    print("Franjas")
    W = 2400

    # Plano medio: lomas rojas con lugar para molinos.
    Hm = 420
    top = Hm * 0.42 + wave(W, [(2, Hm * 0.13, 0.3), (3, Hm * 0.06, 1.7), (5, Hm * 0.025, 0.9)])
    lomas = band(grain(W, Hm, RED, RED_GRAIN, 0.06, 11), top, Hm, RED)
    save(lomas, "lomas.webp", quality=82)
    # Molinos sobre las cimas: x en % del ancho, y de la base en % del alto,
    # y escala relativa a la altura de la franja.
    mills = []
    for frac, scale in ((0.16, 0.52), (0.47, 0.36), (0.78, 0.46)):
        x = int(frac * W)
        win = slice(max(x - 30, 0), min(x + 30, W))
        base = float(top[win].max()) + Hm * 0.06
        mills.append({"x": round(frac * 100, 2), "base": round(base / Hm * 100, 2), "h": scale})
    meta["lomas"] = {"w": W, "h": Hm, "mills": mills}

    # Fondo: sierra de picos, en el mismo rojo (el componente la aclara).
    Hs = 360
    top_s = peaks(W, Hs, 5, seed=7)
    sierra = band(grain(W, Hs, RED, RED_GRAIN, 0.05, 12), top_s, Hs, RED)
    save(sierra, "sierra.webp", quality=80)
    meta["sierra"] = {"w": W, "h": Hs}

    # Primer plano: loma negra con las flores del original.
    Wg = strip.shape[1] * 2
    Hg = strip.shape[0] + 70
    top_g = Hg * 0.16 + wave(Wg, [(1, Hg * 0.06, 2.1), (3, Hg * 0.035, 0.4), (4, Hg * 0.015, 2.9)])
    suelo = band(grain(Wg, Hg, INK, INK_GRAIN, 0.085, 13), top_g, Hg, INK)
    paste(suelo, strip, 0, Hg - strip.shape[0] - 4)
    paste(suelo, strip[:, ::-1].copy(), strip.shape[1], Hg - strip.shape[0] - 4)
    save(suelo, "suelo.webp", quality=84)
    meta["suelo"] = {"w": Wg, "h": Hg}

    print(json.dumps(meta, indent=2))
    (OUT / "escena.json").write_text(json.dumps(meta, indent=2) + "\n")


if __name__ == "__main__":
    main()
