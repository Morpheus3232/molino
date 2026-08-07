import UniversityFooter from "@/components/layout/UniversityFooter";

const sections = [
  {
    title: "1. Aceptación de los términos",
    body: `Al acceder y utilizar Molino, aceptás estos términos y condiciones. Si no estás de acuerdo, no utilices la plataforma.

Molino es una herramienta educativa de código abierto que explora sistemas simbólicos (numerología, astrología, zodíaco chino) con fines de autoconocimiento y reflexión personal.

**Jurisdicción y legislación aplicable:** Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa se someterá a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, con renuncia a cualquier otro fuero. Para usuarios en la UE, se aplican las protecciones del RGPD (Reglamento 2016/679). Para usuarios en California, se aplica la CCPA.`,
  },
  {
    title: "2. Naturaleza del servicio",
    body: `Molino proporciona cálculos basados en sistemas simbólicos tradicionales. Estos sistemas:

- No son científicos ni médicos.
- No constituyen predicción, diagnóstico ni consejo profesional (legal, financiero, médico, psicológico).
- Son herramientas de reflexión y autoconocimiento basadas en tradiciones milenarias.

**Disclaimer completo:** La información en Molino tiene fines educativos y de entretenimiento. No sustituye asesoramiento profesional. Las interpretaciones (incluidas las asistidas por IA) son síntesis simbólicas, no verdades absolutas. Cada persona es responsable de sus decisiones. Molino no garantiza resultados específicos.`,
  },
  {
    title: "3. Cuenta Premium",
    body: `Molino ofrece una capa Premium opcional que incluye interpretaciones asistidas por IA y funcionalidades adicionales.

- El acceso Premium se activa mediante pago único a través de Mercado Pago (Argentina/LatAm) o PayPal (internacional).
- El precio (USD 8) y las condiciones se muestran claramente antes del pago. No hay suscripciones recurrentes ni cargos ocultos.
- El acceso se vincula a un hash SHA-256 de tu perfil (nombre + fecha de nacimiento) y persiste mientras exista el registro en nuestro sistema.
- **Política de reembolsos:** Al ser un servicio digital de entrega inmediata (interpretación IA generada al momento), no ofrecemos reembolsos salvo error técnico comprobable (duplicidad de cargo, fallo de generación). Contactá a pagos@molino.app en 48hs.
- **Duración:** Acceso permanente a la versión actual. Futuras versiones mayores (v2.0+) podrían requerir actualización (comunicado con 90 días de antelación).
- **Cancelación:** Podés solicitar la eliminación de tu hash Premium en cualquier momento (Ajustes → Cuenta → Eliminar cuenta Premium). El acceso se revoca inmediatamente.`,
  },
  {
    title: "4. Propiedad intelectual",
    body: `Molino es software libre licenciado bajo **MIT License**. El código fuente está disponible en GitHub: https://github.com/molino-app/molino

El contenido educativo (textos, explicaciones, fuentes, metodologías) se distribuye bajo los mismos términos de la licencia MIT.

**Contenido generado por IA (Premium):** Las interpretaciones generadas por OpenAI/Anthropic son obra derivada de tu perfil + prompts del sistema. Te concedemos licencia irrevocable, mundial y libre de regalías para usar, copiar, modificar y compartir tus interpretaciones personales. Los proveedores de IA conservan derechos sobre sus modelos (no sobre tus outputs).`,
  },
  {
    title: "5. Limitación de responsabilidad",
    body: `En la máxima medida permitida por la ley, Molino y sus creadores no serán responsables por:

- Decisiones tomadas basadas en las interpretaciones de la plataforma.
- Daños directos, indirectos, incidentales, consecuentes, punitivos o especiales.
- Interrupciones del servicio, pérdida de datos, o acceso no autorizado (a pesar de medidas de seguridad razonables).
- Acciones de terceros (proveedores de pago, IA, hosting).
- Contenido generado por usuarios o IA.

**Límite monetario:** Si alguna jurisdicción no permite excluir responsabilidad, nuestra responsabilidad total se limita al monto pagado por el usuario (máx. USD 8) o USD 1 si no hubo pago.

**Jurisdicciones con protecciones irrenunciables:** En la UE (RGPD), Argentina (Ley 25.326), y California (CCPA), los derechos estatutarios prevalecen sobre esta cláusula.`,
  },
  {
    title: "6. Cambios en los términos",
    body: `Nos reservamos el derecho de modificar estos términos. Los cambios significativos se comunicarán a través del sitio web (banner en homepage) y, si tenés Premium activo, por email con 30 días de antelación.

El uso continuado tras la notificación implica aceptación. Si no estás de acuerdo, podés cancelar tu acceso Premium (ver §3).

**Última actualización:** 7 de agosto de 2025

**Historial de versiones:** Disponible en GitHub para transparencia total.`,
  },
  {
    title: "7. Contacto",
    body: `Para preguntas sobre estos términos, contactanos a:

**General:** legal@molino.app
**Pagos:** pagos@molino.app
**Privacidad:** privacidad@molino.app
**Seguridad:** security@molino.app

**Repositorio público:** https://github.com/molino-app/molino (issues para transparencia)`,
  },
];

export default function TerminosContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-content py-16 sm:py-24 max-w-3xl mx-auto">
        <div>
          <h1
            className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4 animate-fade-in-up"
          >
            Términos y Condiciones
          </h1>
          <p className="text-muted mb-2 text-sm animate-fade-in-up stagger-1">
            Última actualización: 7 de agosto de 2025
          </p>
          <p className="text-foreground/70 mb-12 leading-relaxed animate-fade-in-up stagger-2">
            Al utilizar Molino, aceptás los siguientes términos y condiciones.
            Leé con atención antes de continuar.
          </p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <section
                key={i}
                className={`border border-ink/10 p-6 sm:p-8 animate-fade-in-up ${i < 6 ? `stagger-${i + 3}` : ""}`}
              >
                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                  {section.title}
                </h2>
                <div className="text-foreground/70 leading-relaxed whitespace-pre-line text-sm">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <UniversityFooter />
    </div>
  );
}
