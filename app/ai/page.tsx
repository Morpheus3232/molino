"use client";

import Link from "next/link";
import { useProfile } from "@/lib/hooks/useProfile";
import { usePremiumAccess } from "@/lib/hooks/usePremiumAccess";
import PremiumChatSection from "@/components/chat/PremiumChatSection";

/**
 * IA — "Preguntale a tu Molino". La capa de diálogo del modelo personal.
 *
 * No es un chatbot genérico: la IA ya tiene tu mapa, tu síntesis (patrones,
 * convergencias, tensiones), tus reglas y tu incertidumbre antes de que
 * escribas — el mismo `buildSynthesis` que alimenta el Mapa y la Lectura.
 * Antes esta ruta redirigía a /explore (un índice de conocimiento), así que
 * la IA no tenía superficie propia.
 *
 * Desde 2026-08-31: la página se enmarca como exploración, no como chatbot.
 * Después de la lectura, el mapa se pone al servicio de una pregunta tuya.
 */
const EJEMPLOS = [
  "Estoy por cambiar de trabajo. ¿Qué de mi mapa conviene tener en cuenta?",
  "¿Por qué me cuesta terminar lo que empiezo?",
  "¿Este es un buen año para mudarme de ciudad?",
  "Tengo una discusión repetida con alguien. ¿Qué dice mi mapa sobre cómo la encaro?",
];

export default function AiPage() {
  const { profile, mounted } = useProfile();
  const { isPremium } = usePremiumAccess(profile?.name, profile?.birthDate ?? "");

  if (!mounted) return null;

  if (!profile) {
    return (
      <main className="min-h-screen bg-background" id="main-content">
        <div className="mx-auto max-w-2xl px-4 sm:px-8 lg:px-12 pt-24 sm:pt-32 pb-24 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-4">
            Primer paso: tu mapa
          </p>
          <h1 className="font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[0.95] tracking-tight text-foreground uppercase">
            Después de la lectura,
            <br />
            la conversación.
          </h1>
          <p className="mt-6 text-base text-muted leading-relaxed">
            La IA de Molino responde desde tu mapa concreto — tus números, tus
            signos y lo que sale de cruzarlos. Necesita que lo construyas primero.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-background rounded-[--radius-md] font-heading text-xs uppercase tracking-wider font-bold hover:bg-accent-hover transition-colors"
          >
            Crear mi mapa →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" id="main-content">
      <div className="mx-auto max-w-[760px] px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-24">
        <header className="border-b border-ink/10 pb-10">
          <Link
            href="/profile"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors"
          >
            ← Mi Mapa
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">Preguntale</p>
          <h1 className="mt-2 font-display text-[clamp(2.25rem,7vw,4rem)] leading-[0.9] tracking-tight text-foreground uppercase">
            Ya sabés lo que
            <br />
            tu mapa dice.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted leading-relaxed">
            Tu lectura te mostró patrones, convergencias y tensiones. Acá, esas
            mismas coordenadas se ponen al servicio de una pregunta tuya — la que
            sea, sobre el momento o la situación que te trae.
          </p>
        </header>

        {isPremium ? (
          <div className="pt-10">
            <PremiumChatSection profile={profile} />
          </div>
        ) : (
          <div className="pt-10">
            <div className="rounded-[--radius-lg] border border-ink/10 bg-paper p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
                Ejemplos de lo que el mapa puede ayudarte a pensar
              </p>
              <ul className="space-y-3">
                {EJEMPLOS.map((q) => (
                  <li
                    key={q}
                    className="flex items-start gap-3 text-sm text-foreground leading-relaxed"
                  >
                    <span className="w-3 h-px bg-accent mt-[0.7em] shrink-0" aria-hidden="true" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 border-t border-ink/10 pt-8">
              <p className="text-sm text-muted leading-relaxed max-w-xl">
                La conversación con tu mapa forma parte de la Lectura Pro (pago único de
                8 dólares, acceso permanente). Incluye 50 preguntas.
              </p>
              <Link
                href={`/lectura`}
                className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-background rounded-[--radius-md] font-heading text-xs uppercase tracking-wider font-bold hover:bg-accent-hover transition-colors"
              >
                Ver la Lectura Pro →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
