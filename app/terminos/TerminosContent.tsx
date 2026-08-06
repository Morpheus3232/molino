import UniversityFooter from "@/components/layout/UniversityFooter";

const sections = [
  {
    title: "1. Aceptación de los términos",
    body: `Al acceder y utilizar Molino, aceptás estos términos y condiciones. Si no estás de acuerdo, no utilices la plataforma.

Molino es una herramienta educativa de código abierto que explora sistemas simbólicos (numerología, astrología, zodíaco chino) con fines de autoconocimiento y reflexión personal.

[PLACEHOLDER — Agregar jurisdicción aplicable y legislación]`,
  },
  {
    title: "2. Naturaleza del servicio",
    body: `Molino proporciona cálculos basados en sistemas simbólicos tradicionales. Estos sistemas:
- No son científicos ni médicos.
- No constituyen predicción, diagnóstico ni consejo profesional.
- Son herramientas de reflexión y autoconocimiento.

Los disclaimers específicos se muestran en cada sección de la plataforma.

[PLACEHOLDER — Agregar disclaimer completo de no responsabilidad]`,
  },
  {
    title: "3. Cuenta Premium",
    body: `Molino ofrece una capa Premium opcional que incluye interpretaciones asistidas por IA y funcionalidades adicionales.

- El acceso Premium se activa mediante pago a través de Mercado Pago o PayPal.
- El precio y las condiciones se muestran antes del pago.
- El acceso se vincula a tu perfil (hash de nombre y fecha de nacimiento) y persiste mientras exista el registro en nuestro sistema.

[PLACEHOLDER — Agregar política de reembolsos, duración del acceso, y condiciones de cancelación]`,
  },
  {
    title: "4. Propiedad intelectual",
    body: `Molino es software libre licenciado bajo MIT. El código fuente está disponible en GitHub.

El contenido educativo (textos, explicaciones, fuentes) se distribuye bajo los mismos términos de la licencia MIT.

[PLACEHOLDER — Agregar detalles de propiedad intelectual del contenido generado por IA si corresponde]`,
  },
  {
    title: "5. Limitación de responsabilidad",
    body: `En la máxima medida permitida por la ley, Molino y sus creadores no serán responsables por:
- Decisiones tomadas basadas en las interpretaciones de la plataforma.
- Daños directos, indirectos, incidentales o consecuentes.
- Interrupciones del servicio o pérdida de datos.

[PLACEHOLDER — Agregar limitaciones específicas según jurisdicción]`,
  },
  {
    title: "6. Cambios en los términos",
    body: `Nos reservamos el derecho de modificar estos términos. Los cambios significativos se comunicarán a través del sitio web.

Última actualización: [PLACEHOLDER — Agregar fecha]`,
  },
  {
    title: "7. Contacto",
    body: `Para preguntas sobre estos términos, contactanos a:

[PLACEHOLDER — Agregar email de contacto]`,
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
            Última actualización: [PLACEHOLDER — Fecha]
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

          <div className="mt-12 p-6 border border-ink/10 bg-muted/20 animate-fade-in-up stagger-7">
            <p className="text-xs text-muted leading-relaxed">
              Este documento tiene carácter informativo y contiene placeholders
              que deben ser completados con asesoramiento legal antes de su
              publicación. Molino no provee asesoramiento legal.
            </p>
          </div>
        </div>
      </div>
      <UniversityFooter />
    </div>
  );
}
