import Link from "next/link";

const sections = [
  {
    title: "1. Datos que recopilamos",
    body: `Molino opera bajo el principio de minimización de datos. Recopilamos únicamente:

- **Fecha de nacimiento** (obligatoria): Se ingresa en el navegador y se procesa localmente para calcular tu mapa personal. No se almacena en servidores de Molino para usuarios sin acceso Premium.
- **Eventos anónimos** (automático): Registramos eventos agregados y anónimos directamente en tu navegador (localStorage) para mejorar el producto. Estos eventos NO contienen datos personales — ver sección 7 para detalles.

**Usuarios Premium:** Al activar Premium, se genera un hash HMAC-SHA256 de tu fecha de nacimiento para verificar tu acceso sin almacenar los datos en claro. Este hash se guarda en nuestra base de datos junto con el estado de tu suscripción.`,
  },
  {
    title: "2. Cómo usamos tus datos",
    body: `Tus datos se utilizan exclusivamente para:

- Calcular tu mapa personal de numerología, astrología y zodíaco chino (procesamiento 100% local en el navegador).
- Procesar pagos Premium a través de Mercado Pago (este proveedor recibe solo los datos necesarios para la transacción: email, monto, hash de verificación).
- Generar interpretaciones asistidas por IA (solo para usuarios Premium, a través de OpenRouter (routing) y DeepSeek v4 (modelo de IA), bajo acuerdos de confidencialidad y sin uso de datos para entrenamiento).
- Analítica de uso anónima y agregada (eventos en localStorage, sin servidor) para mejorar la experiencia.

**Base legal (RGPD Art. 6):**
- Ejecución de contrato (Art. 6.1.b): procesamiento de pagos y entrega del servicio Premium.
- Consentimiento (Art. 6.1.a): analítica (opt-in).
- Interés legítimo (Art. 6.1.f): mejora del servicio con datos agregados anónimos.

**Retención:** Los datos de pago los conservan los proveedores según sus políticas (mínimo 5-10 años por obligaciones fiscales). Tu perfil local (localStorage) persiste hasta que lo borrás. El hash de verificación Premium se elimina a los 30 días de cancelar la suscripción. Los eventos de analítica se almacenan en localStorage de tu navegador y se borran cuando limpiás el almacenamiento.`,
  },
  {
    title: "3. Almacenamiento y seguridad",
    body: `Tu perfil se guarda en el almacenamiento local de tu navegador (localStorage). No enviamos tu perfil a nuestros servidores, excepto cuando:

- Activás una compra Premium (se genera un identificador hash HMAC-SHA256 de tu fecha de nacimiento para verificar tu acceso).
- Solicitás una interpretación con IA (tu perfil simbólico —sin nombre real si no lo diste— se envía a proveedores de IA bajo acuerdos de confidencialidad y data processing addendums).

**Medidas de seguridad:**
- HTTPS obligatorio (TLS 1.2+) en todas las conexiones.
- Content Security Policy estricta.
- Headers de seguridad: HSTS, X-Frame-Options, Referrer-Policy.
- No almacenamos contraseñas (no hay autenticación tradicional).
- El hash Premium es irreversible (no permite recuperar nombre ni fecha).

**Cifrado en tránsito:** Todo el tráfico viaja sobre TLS. Los proveedores de pago e IA usan sus propios certificados y estándares (PCI-DSS para pagos).`,
  },
  {
    title: "4. Proveedores externos",
    body: `Utilizamos los siguientes proveedores de terceros:

| Proveedor | Propósito | Datos recibidos | Política de privacidad |
|-----------|-----------|-----------------|------------------------|
| Mercado Pago | Procesamiento de pagos | Email, hash de perfil, monto, país | https://www.mercadopago.com.ar/privacy |
| OpenRouter (routing) | Generación de interpretaciones IA (Premium) | Perfil simbólico, preguntas, nombre (si diste) | https://openrouter.ai/privacy |
| DeepSeek v4 (modelo de IA) | Generación de interpretaciones IA (Premium) | Perfil simbólico, preguntas, nombre (si diste) | https://api-docs.deepseek.com |
| Vercel | Hosting y edge functions | Logs de acceso, métricas de rendimiento | https://vercel.com/privacy |

Todos los proveedores firman Data Processing Agreements (DPAs) y cláusulas contractuales estándar para transferencias internacionales.`,
  },
  {
    title: "5. Tus derechos",
    body: `De acuerdo con la legislación aplicable (RGPD, LOPD, CCPA), tenés derecho a:

- **Acceso:** Solicitar una copia de los datos que tenemos sobre vos (hash Premium, logs de pago anonimizados).
- **Supresión:** Solicitar que eliminemos tus datos (cancelación de Premium + borrado de hash en <30 días).
- **Portabilidad:** Exportar tu perfil en formato JSON (disponible desde la configuración de tu mapa → "Exportar datos").
- **Oposición:** Oponerte al procesamiento para analítica (desactivable en Ajustes) o marketing (no hacemos).
- **Limitación:** Pedir que limitemos el procesamiento mientras se verifica una reclamación.
- **No decisiones automatizadas:** No tomamos decisiones automatizadas con efecto legal.

**Para ejercer estos derechos:** Escribinos a **privacidad@molino.app** (respuesta en <30 días según RGPD). Incluí tu hash de perfil (visible en Ajustes → Cuenta) para identificación.

**Autoridad de control:** Podés presentar reclamación ante la AEPD (España), AAIP (Argentina), o la autoridad de tu país de residencia.`,
  },
  {
    title: "6. Cookies y tecnologías de rastreo",
    body: `Molino **no utiliza cookies de rastreo, marketing, ni sesión**. El único almacenamiento que utilizamos es el **localStorage** de tu navegador, que:

- Es controlado exclusivamente por vos (podés borrarlo en cualquier momento desde DevTools o Ajustes del navegador).
- No es accesible por terceros (same-origin policy).
- No se envía automáticamente con cada request HTTP (a diferencia de cookies).

**Sin banners innecesarios:** Al no usar cookies de rastreo ni datos personales sin consentimiento, no requerimos banner de cookies bajo ePrivacy/RGPD.`,
  },
  {
    title: "7. Analítica anónima (localStorage)",
    body: `Molino registra eventos de uso de forma **100% anónima y local** en tu navegador. No enviamos estos eventos a servidores. No utilizamos Google Analytics, PostHog, ni ningún servicio de rastreo de terceros.

**Qué eventos registramos (solo en tu navegador):**
- \`page_view\`: Qué páginas visitás (sin datos personales)
- \`onboarding_completed\`: Si completás el onboarding
- \`return_visit\`: Si volvés en un día diferente (medido por fecha en localStorage)
- \`feature_used\`: Qué funciones usás (ej: "compartir", "descargar")
- \`paywall_viewed\`, \`payment_approved\`, \`premium_unlocked\`: Eventos de compra
- \`profile_created\`: Perfil creado (puede incluir lifePath, archetype agregados **solo en localStorage local**, nunca en servidor)

**Qué NO registramos NUNCA:**
- Tu fecha de nacimiento
- Tu nombre
- Tu país
- Tu camino de vida, signo solar, zodiaco chino
- Cualquier dato de tu perfil personal

**Cómo verificar:** Abrí DevTools → Application → LocalStorage → busca \`molino-analytics-\`. Verás que los eventos solo contienen nombre del evento, timestamp y un ID de sesión anónimo. No hay datos del perfil.

**Tus eventos, tu control:**
- Podés borrar todos los eventos desde el panel en \`/analytics\`
- Podés borrar el localStorage completo desde DevTools o Ajustes del navegador
- Los eventos no se envían a ningún servidor — solo existen en tu navegador`,
  },
  {
    title: "8. Menores de edad",
    body: `Molino no está dirigido a menores de 16 años. No recopilamos intencionalmente datos de menores.

Si detectamos que un menor de 16 años ha proporcionado datos (ej. al comprar Premium), procederemos a eliminar la información y cancelar la suscripción. Los padres/tutores pueden contactarnos a privacidad@molino.app para solicitar supresión.`,
  },
  {
    title: "9. Cambios en esta política",
    body: `Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios significativos se comunicarán a través del sitio web (banner en homepage) y, si tenés Premium activo, por email.

**Última actualización:** 12 de agosto de 2026

**Historial de versiones:** Disponible en GitHub (repositorio público) para transparencia total.`,
  },
  {
    title: "10. Contacto",
    body: `Si tenés preguntas sobre esta política de privacidad o sobre el tratamiento de tus datos, contactanos a:

**Responsable del tratamiento:** Molino (proyecto de código abierto)
**Email:** privacidad@molino.app
**Repositorio:** https://github.com/Morpheus3232/molino (issues públicos para transparencia)
**Dirección:** Proyecto distribuido, sin sede física única

Para consultas sobre pagos: pagos@molino.app
Para consultas técnicas/seguridad: security@molino.app`,
  },
];

export default function PrivacidadContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-content py-16 sm:py-24 max-w-3xl mx-auto">
        <div>
          <nav className="flex items-center gap-2 text-xs text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Privacidad</span>
          </nav>

          <h1
            className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4 animate-fade-in-up"
          >
            Política de Privacidad
          </h1>
          <p className="text-muted mb-2 text-sm animate-fade-in-up stagger-1">
            Última actualización: 12 de agosto de 2026
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

          <div className="text-center border-t border-ink/10 pt-16 mt-10">
            <Link
              href="/"
              className="text-sm font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
