"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import { PRICING_FAQS, type PricingFAQItem } from "./pricing-data";

interface PricingFAQProps {
  items?: PricingFAQItem[];
}

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

export default function PricingFAQ({ items = PRICING_FAQS }: PricingFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="pricing-faq" className="bg-background border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-12">
        <motion.h2
          {...fadeUp}
          className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground text-center mb-3 leading-[1.05]"
        >
          Preguntas frecuentes
        </motion.h2>
        <motion.p {...fadeUp} className="text-center text-muted text-sm sm:text-base mb-12">
          Sobre planes, pagos y cancelación.
        </motion.p>

        <motion.div {...fadeUp}>
          {items.map((faq, i) => (
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
