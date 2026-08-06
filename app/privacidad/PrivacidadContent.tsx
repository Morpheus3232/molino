import UniversityFooter from "@/components/layout/UniversityFooter";

const sections = [
  {
    title: "1. Datos que recopilamos",
    body: `Molino opera bajo el principio de minimización de datos. Recopilamos únicamente:

- **Fecha de nacimiento** (obligatoria): Se ingresa en el navegador y se procesa localmente para calcular tu mapa personal. No se almacena en servidores de Molino para usuarios sin acceso Premium.
- **Nombre** (opcional): Solo si lo proporcionás para activar cálculos adicionales de numerología.
- **País de ubicación** (opcional): Para adaptar contenido cultural.

[PLACEHOLDER — Agregar detalle completo de datos de Premium si corresponde]`,
  },
  {
    title: "2. Cómo usamos tus datos",
    body: `Tus datos se utilizan exclusivamente para:
- Calcular tu mapa personal de numerología, astrología y zodíaco chino.
- Procesar pagos Premium a través de Mercado Pago y PayPal (estos proveedores reciben los datos necesarios para procesar la transacción).
- Generar interpretaciones asistidas por IA (solo para usuarios Premium, a través de OpenAI y Anthropic).

[PLACEHOLDER — Agregar detalle de retención de datos y bases legales (RGPD Art. 6)]`,
  },
  {
    title: "3. Almacenamiento y seguridad",
    body: `Tu perfil se guarda en el almacenamiento local de tu navegador (localStorage). No enviamos tu perfil a nuestros servidores, excepto cuando:
- Activás una compra Premium (se genera un identificador hash para verificar tu acceso).
- Solicitás una interpretación con IA (tu perfil se envía a proveedores de IA bajo confidencialidad).

[PLACEHOLDER — Agregar detalle de cifrado en tránsito, políticas de retención, y medidas de seguridad]`,
  },
  {
    title: "4. Proveedores externos",
    body: `Utilizamos los siguientes proveedores de terceros:

| Proveedor | Propósito | Datos recibidos |
|-----------|-----------|-----------------|
| Mercado Pago | Procesamiento de pagos | Nombre, hash de perfil, monto |
| PayPal | Procesamiento de pagos | Hash de perfil, monto |
| OpenAI / Anthropic | Generación de interpretaciones IA (Premium) | Nombre, perfil simbólico, preguntas |
| Vercel | Hosting de la aplicación | Datos de la aplicación |
| PostHog | Análisis de uso (opcional, cookieless) | Eventos anónimos de uso |

[PLACEHOLDER — Agregar links a políticas de privacidad de cada proveedor]`,
  },
  {
    title: "5. Tus derechos",
    body: `De acuerdo con la legislación aplicable (RGPD, LOPD, CCPA), tenés derecho a:
- **Acceso:** Solicitar una copia de los datos que tenemos sobre vos.
- **Supresión:** Solicitar que eliminemos tus datos.
- **Portabilidad:** Exportar tu perfil en formato JSON (disponible desde la configuración de tu mapa).
- **Oposición:** Oponerte al procesamiento de tus datos para fines específicos.

Para ejercer estos derechos, contactanos a: [PLACEHOLDER — Agregar email de contacto]

[PLACEHOLDER — Agregar plazos de respuesta, procedimiento de verificación de identidad, y autoridad de control]`,
  },
  {
    title: "6. Cookies y tecnologías de rastreo",
    body: `Molino no utiliza cookies de rastreo. El único almacenamiento que utilizamos es el localStorage de tu navegador, que es controlado exclusivamente por vos y no es accesible por terceros.

Si se configura PostHog (análisis de uso), opera en modo cookieless: no utiliza cookies ni identificadores persistentes.

[PLACEHOLDER — Agregar detalle si se implementa algún banner de cookies en el futuro]`,
  },
  {
    title: "7. Menores de edad",
    body: `Molino no está dirigido a menores de 16 años. No recopilamos intencionalmente datos de menores.

[PLACEHOLDER — Agregar detalle de políticas para menores si corresponde]`,
  },
  {
    title: "8. Cambios en esta política",
    body: `Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios significativos se comunicarán a través del sitio web.

Última actualización: [PLACEHOLDER — Agregar fecha]

[PLACEHOLDER — Agregar procedimiento de notificación de cambios]`,
  },
  {
    title: "9. Contacto",
    body: `Si tenés preguntas sobre esta política de privacidad o sobre el tratamiento de tus datos, contactanos a:

[PLACEHOLDER — Agregar email de contacto, nombre del responsable, y dirección si corresponde]`,
  },
];

export default function PrivacidadContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-content py-16 sm:py-24 max-w-3xl mx-auto">
        <div>
          <h1
            className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4 animate-fade-in-up"
          >
            Política de Privacidad
          </h1>
          <p className="text-muted mb-2 text-sm animate-fade-in-up stagger-1">
            Última actualización: [PLACEHOLDER — Fecha]
          </p>
          <p className="text-foreground/70 mb-12 leading-relaxed animate-fade-in-up stagger-2">
            En Molino, tu privacidad es una prioridad. Esta política describe
            cómo recopilamos, usamos y protegemos tu información cuando
            utilizás nuestra plataforma.
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
