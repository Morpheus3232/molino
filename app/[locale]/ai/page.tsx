"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
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
const EJEMPLOS = (L: Pick2) => ([
  L("Estoy por cambiar de trabajo. ¿Qué de mi mapa conviene tener en cuenta?", "I'm about to change jobs. What in my map should I keep in mind?"),
  L("¿Por qué me cuesta terminar lo que empiezo?", "Why do I struggle to finish what I start?"),
  L("¿Este es un buen año para mudarme de ciudad?", "Is this a good year to move to another city?"),
  L("Tengo una discusión repetida con alguien. ¿Qué dice mi mapa sobre cómo la encaro?", "I keep having the same argument with someone. What does my map say about how to approach it?"),
]);

export default function AiPage() {
  const L = useL();
  const { profile, mounted } = useProfile();
  const { isPremium } = usePremiumAccess(profile?.name, profile?.birthDate ?? "");

  if (!mounted) return null;

  if (!profile) {
    return (
      <main className="min-h-screen bg-background" id="main-content">
        <div className="mx-auto max-w-2xl px-4 sm:px-8 lg:px-12 pt-24 sm:pt-32 pb-24 text-center">
          <p className="text-sm text-accent mb-4 label-caps">{L("Primer paso: tu mapa", "First step: your map")}</p>
          <h1 className="page-title text-foreground">{L(<>
            Después de la lectura,
            <br />
            la conversación.
          </>, <>After the reading,<br />the conversation.</>)}</h1>
          <p className="mt-6 text-base text-muted leading-relaxed">{L("La IA de Molino responde desde tu mapa concreto — tus números, tus signos y lo que sale de cruzarlos. Necesita que lo construyas primero.", "Molino's AI answers from your specific map — your numbers, your signs and what comes from crossing them. It needs you to build it first.")}</p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps"
          >{L("Crear mi mapa", "Create my map")}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" id="main-content">
      <div className="mx-auto max-w-[960px] px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-24">
        <header className="pb-10">
          <Link
            href="/profile"
            className="text-sm text-muted hover:text-foreground hover:underline underline-offset-4 transition-colors"
          >{L("← Volver a tu mapa", "← Back to your map")}</Link>
          <p className="mt-8 text-sm text-accent label-caps">{L("Preguntale", "Ask it")}</p>
          <h1 className="page-title mt-2 text-foreground">{L(<>
            Ya sabés lo que
            <br />
            tu mapa dice.
          </>, <>You already know what<br />your map says.</>)}</h1>
          <p className="mt-6 max-w-xl text-lg text-muted leading-relaxed">{L("Tu lectura te mostró patrones, convergencias y tensiones. Acá, esas mismas coordenadas se ponen al servicio de una pregunta tuya — la que sea, sobre el momento o la situación que te trae.", "Your reading showed you patterns, convergences and tensions. Here, those same coordinates are put to work on a question of yours — whatever it is, about the moment or the situation that brings you here.")}</p>
        </header>

        {isPremium ? (
          <div className="pt-10">
            <PremiumChatSection profile={profile} />
          </div>
        ) : (
          <div className="pt-10">
            <p className="text-sm text-muted mb-2 label-caps">{L("Ejemplos de lo que el mapa puede ayudarte a pensar", "Examples of what the map can help you think through")}</p>
            <ul className="border-t border-ink/15">
              {EJEMPLOS(L).map((q) => (
                <li key={q} className="py-4 border-b border-ink/15 font-display text-xl sm:text-2xl leading-snug text-foreground">
                  {q}
                </li>
              ))}
            </ul>
            <div className="mt-10 border-2 border-ink p-6 sm:p-8">
              <p className="text-lg text-muted leading-relaxed max-w-xl">{L("La conversación con tu mapa forma parte de la Lectura Pro (pago único de 8 dólares, acceso permanente). Incluye 50 preguntas.", "The conversation with your map is part of the Pro Reading (a one-time payment of 8 dollars, permanent access). It includes 50 questions.")}</p>
              <Link
                href={`/lectura`}
                className="mt-6 inline-flex items-center justify-center gap-2 px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps"
              >{L("Ver la Lectura Pro", "See the Pro Reading")}</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
