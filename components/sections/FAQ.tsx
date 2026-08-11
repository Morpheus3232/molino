"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";

const FAQS = [
  {
    question: "¿Es científico lo que hace Molino?",
    answer:
      "Molino cruza tres sistemas simbólicos —numerología, astrología y zodíaco chino— que han sido usados durante siglos para reflexionar sobre la personalidad. No es ciencia en el sentido experimental, pero sí es una herramienta honesta de autoconocimiento.",
  },
  {
    question: "¿Por qué cruzan tres sistemas diferentes?",
    answer:
      "Cada sistema mira tu identidad desde un ángulo distinto. Juntos, ofrecen una imagen más completa que cualquiera por separado.",
  },
  {
    question: "¿Qué pasa con mis datos?",
    answer:
      "Tu mapa se calcula enteramente en tu navegador: la fecha de nacimiento nunca sale de tu dispositivo ni se guarda en ninguna base de datos. La única excepción es si pedís una interpretación con IA — ahí sí tu perfil viaja a nuestro servidor para generarla, sin guardarse.",
  },
  {
    question: "¿Necesito registrarme?",
    answer:
      "No. Podés generar tu mapa sin crear cuenta, sin email y sin contraseña.",
  },
  {
    question: "¿Puedo compartir mi mapa?",
    answer:
      "Sí. Una vez generado, podés descargarlo o compartir el link. El mapa es tuyo.",
  },
  {
    question: "¿Es gratis?",
    answer:
      "Sí. Generar tu mapa personal es completamente gratuito.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div className="border-b border-ink/10">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-4 py-5 sm:py-6 text-left transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="font-heading text-base sm:text-lg text-foreground group-hover:text-accent transition-colors">
            {question}
          </span>
          <span className="shrink-0 text-accent" aria-hidden="true">
            {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm sm:text-base text-muted leading-relaxed pb-5 sm:pb-6 max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-ink/[0.02] border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-12">
        <motion.h2
          {...fadeUp}
          className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground text-center mb-12 leading-[1.05]"
        >
          Preguntas frecuentes
        </motion.h2>

        <motion.div {...fadeUp}>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((current) => (current === i ? null : i))}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
