import { useL, type Pick2 } from "@/lib/i18n/useL";
import LegalText from "@/components/legal/LegalText";

const CONTACTO = "versionlimitada@proton.me";

const sections = (L: Pick2) => ([
  {
    title: L("1. Aceptación de los términos", "1. Acceptance of the terms"),
    body: L(`Al acceder y utilizar Molino, aceptás estos términos y condiciones. Si no estás de acuerdo, no utilices la plataforma.

Molino es una herramienta educativa de código abierto que explora sistemas simbólicos (numerología, astrología, zodíaco chino) con fines de autoconocimiento y reflexión personal.

**Jurisdicción y legislación aplicable:** Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa se someterá a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, con renuncia a cualquier otro fuero. Para usuarios en la UE, se aplican las protecciones del RGPD (Reglamento 2016/679). Para usuarios en California, se aplica la CCPA.`, "By accessing and using Molino, you accept these terms and conditions. If you don't agree, don't use the platform.\n\nMolino is an open-source educational tool that explores symbolic systems (numerology, astrology, Chinese zodiac) for the purposes of self-knowledge and personal reflection.\n\n**Jurisdiction and governing law:** These terms are governed by the laws of the Argentine Republic. Any dispute will be submitted to the ordinary courts of the Autonomous City of Buenos Aires, waiving any other jurisdiction. For users in the EU, the protections of the GDPR (Regulation 2016/679) apply. For users in California, the CCPA applies."),
  },
  {
    title: L("2. Naturaleza del servicio", "2. Nature of the service"),
    body: L(`Molino proporciona cálculos basados en sistemas simbólicos tradicionales. Estos sistemas:

- No son científicos ni médicos.
- No constituyen predicción, diagnóstico ni consejo profesional (legal, financiero, médico, psicológico).
- Son herramientas de reflexión y autoconocimiento basadas en tradiciones milenarias.

**Disclaimer completo:** La información en Molino tiene fines educativos y de entretenimiento. No sustituye asesoramiento profesional. Las interpretaciones (incluidas las asistidas por IA) son síntesis simbólicas, no verdades absolutas. Cada persona es responsable de sus decisiones. Molino no garantiza resultados específicos.`, "Molino provides calculations based on traditional symbolic systems. These systems:\n\n- Are neither scientific nor medical.\n- Do not constitute prediction, diagnosis or professional advice (legal, financial, medical, psychological).\n- Are tools for reflection and self-knowledge based on age-old traditions.\n\n**Full disclaimer:** The information on Molino is for educational and entertainment purposes. It does not replace professional advice. Interpretations (including AI-assisted ones) are symbolic syntheses, not absolute truths. Each person is responsible for their own decisions. Molino does not guarantee specific results."),
  },
  {
    title: L("3. Cuenta Premium", "3. Premium account"),
    body: L(`Molino ofrece una capa Premium opcional que incluye interpretaciones asistidas por IA y funcionalidades adicionales.

- El acceso Premium se activa con un pago único, por Mercado Pago o con Bitcoin.
- El precio es USD 8 ($ 11.880 si pagás en pesos con Mercado Pago, o su equivalente en bitcoin al momento de pagar) y se muestra antes de pagar. No hay suscripciones recurrentes ni cargos ocultos.
- El acceso se vincula a un hash HMAC-SHA256 de tu perfil (nombre, fecha de nacimiento e identificador de tu dispositivo) y persiste mientras exista ese registro en nuestro sistema.
- **Política de reembolsos:** Al ser un servicio digital de entrega inmediata (interpretación IA generada al momento), no ofrecemos reembolsos salvo error técnico comprobable (duplicidad de cargo, fallo de generación). Escribinos a ${CONTACTO} dentro de las 48 horas.
- **Duración:** Acceso permanente a la versión actual. Futuras versiones mayores (v2.0+) podrían requerir actualización (comunicado con 90 días de antelación).
- **Cancelación:** Podés pedir que borremos tu registro Premium en cualquier momento escribiendo a ${CONTACTO} con tu ID de pago. El acceso se revoca al borrarlo.`, `Molino offers an optional Premium layer that includes AI-assisted interpretations and additional features.\n\n- Premium access is activated with a one-time payment, via Mercado Pago or with Bitcoin.\n- The price is USD 8 (ARS 11,880 if you pay in pesos with Mercado Pago, or its equivalent in bitcoin at the time of payment) and is shown before you pay. There are no recurring subscriptions or hidden charges.\n- Access is linked to an HMAC-SHA256 hash of your profile (name, date of birth and your device identifier) and persists as long as that record exists in our system.\n- **Refund policy:** As a digital service delivered immediately (AI interpretation generated on the spot), we don't offer refunds except in the case of a verifiable technical error (duplicate charge, generation failure). Write to us at ${CONTACTO} within 48 hours.\n- **Duration:** Permanent access to the current version. Future major versions (v2.0+) may require an upgrade (announced 90 days in advance).\n- **Cancellation:** You can ask us to delete your Premium record at any time by writing to ${CONTACTO} with your payment ID. Access is revoked when it's deleted.`),
  },
  {
    title: L("4. Propiedad intelectual", "4. Intellectual property"),
    body: L(`Molino es software libre licenciado bajo **MIT License**. El código fuente está disponible en GitHub: https://github.com/Morpheus3232/molino

El contenido educativo (textos, explicaciones, fuentes, metodologías) se distribuye bajo los mismos términos de la licencia MIT.

**Contenido generado por IA (Premium):** Las interpretaciones generadas por el modelo de IA (vía OpenRouter) son obra derivada de tu perfil + prompts del sistema. Te concedemos licencia irrevocable, mundial y libre de regalías para usar, copiar, modificar y compartir tus interpretaciones personales. Los proveedores de IA conservan derechos sobre sus modelos (no sobre tus outputs).`, "Molino is free software licensed under the **MIT License**. The source code is available on GitHub: https://github.com/Morpheus3232/molino\n\nThe educational content (texts, explanations, sources, methodologies) is distributed under the same terms of the MIT license.\n\n**AI-generated content (Premium):** The interpretations generated by the AI model (via OpenRouter) are a derivative work of your profile + the system prompts. We grant you an irrevocable, worldwide, royalty-free license to use, copy, modify and share your personal interpretations. AI providers retain rights over their models (not over your outputs)."),
  },
  {
    title: L("5. Limitación de responsabilidad", "5. Limitation of liability"),
    body: L(`En la máxima medida permitida por la ley, Molino y sus creadores no serán responsables por:

- Decisiones tomadas basadas en las interpretaciones de la plataforma.
- Daños directos, indirectos, incidentales, consecuentes, punitivos o especiales.
- Interrupciones del servicio, pérdida de datos, o acceso no autorizado (a pesar de medidas de seguridad razonables).
- Acciones de terceros (proveedores de pago, IA, hosting).
- Contenido generado por usuarios o IA.

**Límite monetario:** Si alguna jurisdicción no permite excluir responsabilidad, nuestra responsabilidad total se limita al monto pagado por el usuario (máx. USD 8) o USD 1 si no hubo pago.

**Jurisdicciones con protecciones irrenunciables:** En la UE (RGPD), Argentina (Ley 25.326), y California (CCPA), los derechos estatutarios prevalecen sobre esta cláusula.`, "To the maximum extent permitted by law, Molino and its creators shall not be liable for:\n\n- Decisions made based on the platform's interpretations.\n- Direct, indirect, incidental, consequential, punitive or special damages.\n- Service interruptions, data loss, or unauthorized access (despite reasonable security measures).\n- Actions of third parties (payment providers, AI, hosting).\n- Content generated by users or AI.\n\n**Monetary limit:** If any jurisdiction does not allow liability to be excluded, our total liability is limited to the amount paid by the user (max. USD 8) or USD 1 if there was no payment.\n\n**Jurisdictions with non-waivable protections:** In the EU (GDPR), Argentina (Law 25,326) and California (CCPA), statutory rights prevail over this clause."),
  },
  {
    title: L("6. Cambios en los términos", "6. Changes to the terms"),
    body: L(`Nos reservamos el derecho de modificar estos términos. Si cambian, publicamos acá la versión nueva con su fecha.

El uso continuado después de la publicación implica aceptación. Si no estás de acuerdo, podés cancelar tu acceso Premium (ver §3).

**Última actualización:** 4 de octubre de 2026

**Historial de versiones:** Disponible en GitHub para transparencia total.`, "We reserve the right to modify these terms. If they change, we publish the new version here with its date.\n\nContinued use after publication implies acceptance. If you don't agree, you can cancel your Premium access (see §3).\n\n**Last updated:** October 4, 2026\n\n**Version history:** Available on GitHub for full transparency."),
  },
  {
    title: L("7. Contacto", "7. Contact"),
    body: L(`Para preguntas sobre estos términos, pagos, privacidad o seguridad: **${CONTACTO}**

**Repositorio público:** https://github.com/Morpheus3232/molino (issues para transparencia)`, `For questions about these terms, payments, privacy or security: **${CONTACTO}**\n\n**Public repository:** https://github.com/Morpheus3232/molino (issues for transparency)`),
  },
]);

export default function TerminosContent() {
  const L = useL();
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="container-content py-16 sm:py-24 max-w-3xl mx-auto">
        <div>
          <h1
            className="page-title text-foreground mb-4 animate-fade-in-up"
          >{L("Términos y Condiciones", "Terms and Conditions")}</h1>
          <p className="text-muted mb-2 text-sm animate-fade-in-up stagger-1">{L("Última actualización: 4 de octubre de 2026", "Last updated: October 4, 2026")}</p>
          <p className="text-foreground/70 mb-12 leading-relaxed animate-fade-in-up stagger-2">{L("Al utilizar Molino, aceptás los siguientes términos y condiciones. Leé con atención antes de continuar.", "By using Molino, you accept the following terms and conditions. Read them carefully before continuing. This English version is provided for convenience; in case of any discrepancy, the Spanish version prevails.")}</p>

          <div className="space-y-10">
            {sections(L).map((section, i) => (
              <section
                key={i}
                className={`border border-ink/10 p-6 sm:p-8 animate-fade-in-up ${i < 6 ? `stagger-${i + 3}` : ""}`}
              >
                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                  {L.t(section.title)}
                </h2>
                <div className="text-foreground/70 leading-relaxed text-sm">
                  <LegalText body={section.body} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
