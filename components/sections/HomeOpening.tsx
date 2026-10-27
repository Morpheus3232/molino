"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

/* eslint-disable @next/next/no-img-element -- capas de una escena animada:
   ya están optimizadas (WebP) y se repiten en fila; next/image no aporta. */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import s from "./HomeOpening.module.css";

/**
 * Apertura de la portada: Don Quijote y Sancho galopan entre molinos, en un
 * travelling lateral. Es la ilustración licenciada de la portada
 * (public/home/quijote-sancho.jpg) desarmada en capas por
 * scripts/build-home-scene.py: los jinetes son los del original recortados
 * tal cual; las lomas y el suelo son franjas repetibles con el
 * rojo, el negro, el grano y las flores del original; las aspas se dibujan
 * acá para que puedan girar.
 *
 * Las medidas de abajo salen de public/home/escena/escena.json (las imprime
 * el script): si se regeneran las capas, copiarlas de ahí.
 */

const LOMAS = { w: 2400, h: 420 };
const SUELO = { w: 2900, h: 290 };
const MILL_HUB = { x: 40.32, y: 26.07 };
/** x y base en % de la franja de lomas; h = alto de la torre / alto de la franja. */
const MILLS = [
  { x: 16, base: 51.31, h: 0.52, spin: "18s" },
  { x: 47, base: 42.28, h: 0.36, spin: "14s" },
  { x: 78, base: 38.58, h: 0.46, spin: "16s" },
];

/** Don Quijote, primera parte, cap. V: la respuesta de don Quijote cuando
 *  el vecino lo quiere convencer de que no es quien dice ser. */
const LINE = (L: Pick2) => (L("Yo sé quién soy.", "I know who I am."));

/** Cuatro aspas en cruz con su enrejado, como las del original. */
function Sails() {
  const arm = (
    <g>
      <rect x="6" y="-1.6" width="94" height="3.2" />
      <rect x="18" y="-9" width="36" height="1.8" />
      <rect x="18" y="7.2" width="36" height="1.8" />
      {[22, 29, 36, 43, 50].map((x) => (
        <rect key={x} x={x} y="-9" width="1.6" height="18" />
      ))}
      <path d="M52 -15 L97 -15 L97 -18 L101 -18 L101 18 L97 18 L97 15 L52 15 Z" />
    </g>
  );
  return (
    <svg viewBox="-104 -104 208 208" className="block h-full w-full" fill="currentColor" aria-hidden="true">
      {[45, 135, 225, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          {arm}
        </g>
      ))}
      <circle r="7" />
    </svg>
  );
}

function Mill({ x, base, h, spin }: (typeof MILLS)[number]) {
  return (
    <div className={s.mill} style={{ left: `${x}%`, bottom: `${100 - base}%`, height: `${h * 100}%` }}>
      <div
        className={s.sails}
        style={{ left: `${MILL_HUB.x}%`, top: `${MILL_HUB.y}%`, ["--spin" as string]: spin }}
      >
        <Sails />
      </div>
      <img src="/home/escena/molino.webp" alt="" width={124} height={257} draggable={false} />
    </div>
  );
}

/** Una franja del paisaje: tres copias en fila que corren en loop. */
function Strip({
  src,
  size,
  duration,
  children,
}: {
  src: string;
  size: { w: number; h: number };
  duration: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={s.track} style={{ ["--dur" as string]: duration }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className={s.tile} style={{ ["--ar" as string]: `${size.w} / ${size.h}` }}>
          <img src={src} alt="" width={size.w} height={size.h} draggable={false} decoding="async" />
          {children}
        </div>
      ))}
    </div>
  );
}

function Rider({ name, w, h }: { name: "quijote" | "sancho"; w: number; h: number }) {
  const src = `/home/escena/${name}.webp`;
  return (
    <div className={`${s.rider} ${s[name]}`}>
      <div className={s.gait}>
        <img src={src} alt="" width={w} height={h} className={`${s.part} ${s.rear}`} draggable={false} />
        <img src={src} alt="" width={w} height={h} className={`${s.part} ${s.front}`} draggable={false} />
        <img src={src} alt="" width={w} height={h} className={`${s.part} ${s.body}`} draggable={false} fetchPriority="high" />
      </div>
    </div>
  );
}

export default function HomeOpening() {
  const L = useL();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  // Fuera de pantalla no se gasta batería animando.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax al bajar: cada plano se va a su velocidad y la cámara se acerca.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const still = (v: string) => (reduce ? v : undefined);
  const lomasY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const ridersY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const copyY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-55%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const words = LINE(L).split(" ");

  return (
    <section
      ref={ref}
      aria-labelledby="apertura-home"
      className={s.scene}
      data-paused={paused ? "" : undefined}
    >
      <motion.div className={s.world} style={{ scale: reduce ? 1 : zoom }}>
        {/* Plano medio: lomas rojas con molinos que giran */}
        <motion.div className={`${s.layer} ${s.lomas}`} style={{ y: still("0%") ?? lomasY }} aria-hidden="true">
          <Strip src="/home/escena/lomas.webp" size={LOMAS} duration="110s">
            {MILLS.map((m) => (
              <Mill key={m.x} {...m} />
            ))}
          </Strip>
        </motion.div>

        {/* Los jinetes */}
        <motion.div className={s.riders} style={{ y: still("0%") ?? ridersY }}>
          <Rider name="quijote" w={554} h={732} />
          <Rider name="sancho" w={428} h={403} />
        </motion.div>

        {/* Primer plano: la loma negra con las flores, la que más rápido pasa */}
        <div className={`${s.layer} ${s.suelo}`} aria-hidden="true">
          <Strip src="/home/escena/suelo.webp" size={SUELO} duration="34s" />
        </div>
      </motion.div>

      {/* Texto */}
      <motion.div className={s.copy} style={{ y: still("0%") ?? copyY, opacity: reduce ? 1 : copyOpacity }}>
        <p
          id="apertura-home"
          className="text-balance font-display italic font-normal text-ink leading-[1.04] tracking-tight text-[clamp(3.2rem,7.5vw,6.5rem)]"
        >
          <span className="sr-only">{LINE(L)}</span>
          <span aria-hidden="true">
            {/* Las comillas van pegadas a la primera y la última palabra para
                que nunca queden solas en un renglón. */}
            {words.map((w, i) => (
              <span key={i}>
                <span className={s.word} style={{ ["--i" as string]: i }}>
                  {i === 0 ? "«" : ""}
                  {w}
                  {i === words.length - 1 ? "»" : ""}
                </span>
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </p>
        <p className={`${s.late} mt-5 text-sm text-muted label-caps`} style={{ ["--d" as string]: "1.6s" }}>{L(<>
          Cervantes · <em className="not-italic">Don Quijote</em>, I, V
        </>, <>Cervantes · <em className="not-italic">Don Quixote</em>, I, V</>)}</p>
      </motion.div>

    </section>
  );
}
