"use client";

import { useId, useState } from "react";
import { Plus, Minus } from "lucide-react";

export const FAQS = [
  {
    question: "¿Por qué el mapa esencial es 100% gratuito y sin registro?",
    answer:
      "Porque el autoconocimiento de base debe ser libre y accesible. Generás tu lectura completa de numerología, astrología y zodíaco chino al instante en tu pantalla sin tener que crear cuentas, sin dejar tu email y sin publicidad intrusiva.",
  },
  {
    question: "¿Qué incluye el acceso Premium de $8 USD?",
    answer:
      "El acceso Premium (pago único de por vida) incluye la síntesis profunda con narrativa personalizada, ciclos personales 2026–2030, desglose de tensiones arquetípicas y preguntas interactivas.",
  },
  {
    question: "¿Cómo garantizan que mi fecha y datos no se guardan en servidores?",
    answer:
      "Depende de qué uses. Los motores de cálculo corren enteros en tu navegador: si te quedás con el mapa y la lectura gratuitos, tu fecha no sale de tu dispositivo. La Lectura Pro y las preguntas a la IA sí la envían a nuestro servidor (por HTTPS) para poder redactarse, y de ahí al proveedor del modelo — no hay forma de generar ese texto sin mandarle los datos. Lo que sí nunca guardamos es tu fecha: en la base solo queda un hash HMAC-SHA256 irreversible de tu perfil, que sirve para validar tu acceso. Detalle completo en /privacidad.",
  },
  {
    question: "¿Esto predice el futuro?",
    answer:
      "No, y no lo intenta. Molino identifica patrones matemáticos, tensiones entre arquetipos y en qué ciclo estás hoy. Eso sirve para orientar una decisión que igual vas a tomar vos: el mapa muestra el método y el resultado, la lectura de tu propia vida sigue siendo tuya.",
  },
  {
    question: "¿Puedo comparar mi mapa con mi pareja o guardar varios perfiles?",
    answer:
      "Sí. El Modo Pareja (/pareja) te permite cruzar dos fechas para analizar sinergias y desafíos. Además, la Bóveda Local te permite guardar y alternar hasta 30 mapas (pareja, familia, socios) en tu navegador sin crear cuentas.",
  },
  {
    question: "¿Qué son los Números Maestros (11/22/33)?",
    answer:
      "Son vibraciones intensificadas que aparecen cuando la reducción da 11, 22 o 33. No se reducen más: cargan con un significado específico según la posición (Camino de Vida, Expresión o Personalidad). Podés ver el badge en tu resumen de perfil.",
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

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
            className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] hidden"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm sm:text-base text-muted leading-relaxed pb-5 sm:pb-6 max-w-2xl">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-ink/[0.02] border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-12">
        <h2
          className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground text-center mb-12 leading-[1.05]"
        >
          Preguntas frecuentes
        </h2>

        <div>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((current) => (current === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}