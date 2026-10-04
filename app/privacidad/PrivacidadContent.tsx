import Link from "next/link";
import LegalText from "@/components/legal/LegalText";

const CONTACTO = "versionlimitada@proton.me";

const sections = [
  {
    title: "1. Datos que pedimos",
    body: `Molino funciona con lo mínimo:

- **Fecha de nacimiento** (obligatoria): con ella se calcula tu mapa, en tu navegador.
- **Nombre** (opcional): solo si lo cargás. Se usa para personalizar el texto.
- **País** (opcional): ordena qué entidades ves primero en tu mapa.

No hay cuentas, contraseñas ni registro. Tu perfil vive en el almacenamiento local de tu navegador (localStorage) y no lo mandamos a nuestros servidores salvo en los casos de la sección 3.`,
  },
  {
    title: "2. Qué queda solo en tu navegador",
    body: `- Tu perfil (fecha, nombre y país si los diste) y los mapas que guardes.
- Un identificador aleatorio de dispositivo (\`molino-profile-salt\`), que se mezcla con tus datos para que tu hash sea único.
- Si comprás la Lectura Pro: un token de acceso de este dispositivo y una copia de tu lectura.
- Eventos de uso (\`molino-analytics-events\`): qué páginas abrís y qué funciones usás, con fecha y hora. Nunca tu fecha de nacimiento, nombre, país ni ningún dato de tu mapa. No salen de tu navegador; los podés ver y borrar en \`/analytics\`.
- Una copia de páginas del sitio (service worker) para que cargue más rápido.

Todo esto se borra cuando limpiás los datos del sitio en tu navegador.`,
  },
  {
    title: "3. Qué llega a nuestros servidores",
    body: `**Visitas (Vercel Web Analytics):** contamos visitas de forma agregada: página, país, tipo de dispositivo, navegador y sitio de origen. No usa cookies ni guarda tu IP; el identificador de visitante es un hash que se descarta cada día. No hay perfil por persona.

**Compra de la Lectura Pro:** guardamos un hash HMAC-SHA256 de tu nombre normalizado, tu fecha y el identificador de dispositivo. Sin nuestra clave no se puede revertir a tus datos. Junto al hash guardamos: el identificador de dispositivo (para que puedas recuperar la compra desde otro equipo), el ID de pago, un token de acceso (vence a los 180 días y se renueva solo) y las lecturas generadas por IA. Se conserva mientras tengas acceso: es lo que te permite recuperarlo.

**Lecturas con IA (solo Lectura Pro):** el servidor arma tu perfil simbólico (signos, números y elementos derivados de tu fecha, más tu nombre si lo diste) y lo envía al proveedor de IA junto con tus preguntas del chat. No se envía tu fecha de nacimiento completa.

**Compartir tu perfil:** si usás "compartir", tu nombre y fecha se guardan 24 horas bajo un enlace aleatorio para que quien lo abra vea tu mapa. Después se borran solos.

**Regalos:** el código, el ID de pago y si ya fue canjeado (y el hash de quien lo canjeó). Un código sin canjear vence a los 30 días.

**Pago con Bitcoin:** recibimos el ID de la transacción que pegás. Lo verificamos contra la blockchain pública y queda registrado para que no se use dos veces.

**Registros técnicos:** Vercel registra cada pedido al servidor (IP, navegador, página) para operar y proteger el sitio.`,
  },
  {
    title: "4. Proveedores",
    body: `| Proveedor | Para qué | Qué recibe |
|-----------|----------|------------|
| Vercel | Hosting, registros técnicos, Web Analytics | Pedidos al sitio; visitas agregadas sin cookies |
| Upstash (base de datos de Vercel) | Guardar lo descripto en la sección 3 | Hashes, IDs de pago, perfiles compartidos por 24 h |
| Mercado Pago | Cobro de la Lectura Pro | Lo que cargás en su checkout (email, medio de pago); de nosotros: hash del perfil, producto y monto |
| Resend | Email de confirmación de compra | Tu email (el que diste en Mercado Pago) y el ID de pago |
| OpenRouter | Lecturas con IA (Pro) | Perfil simbólico, nombre si lo diste, preguntas del chat. Lo envía al proveedor del modelo configurado |
| mempool.space | Verificar pagos con Bitcoin y cotizar | Solo el ID de transacción; la consulta la hace nuestro servidor, no tu navegador |
| Wikimedia | Imágenes de las entidades del Atlas | Tu navegador las descarga de upload.wikimedia.org: Wikimedia ve tu IP y navegador, como en cualquier imagen externa |

Cada proveedor trata los datos según su propia política de privacidad. No usamos Google Analytics, píxeles de redes sociales ni ningún otro servicio de rastreo.`,
  },
  {
    title: "5. Para qué los usamos y base legal",
    body: `- Calcular tu mapa y mostrártelo (se hace en tu navegador).
- Cobrar y darte acceso a la Lectura Pro: ejecución del contrato.
- Generar tus lecturas con IA: ejecución del contrato.
- Medir visitas en forma agregada y anónima, y mantener el sitio seguro: interés legítimo.

No vendemos datos, no hacemos publicidad ni marketing y no tomamos decisiones automatizadas con efecto legal sobre vos.`,
  },
  {
    title: "6. Seguridad",
    body: `- HTTPS obligatorio, con HSTS.
- Content Security Policy que limita de dónde se cargan scripts, imágenes y marcos.
- Headers de seguridad: X-Frame-Options, Referrer-Policy, X-Content-Type-Options y Permissions-Policy.
- Sin contraseñas que robar: no hay cuentas.
- El acceso Pro exige un token que solo tiene el dispositivo que compró; con tu nombre y fecha no alcanza.`,
  },
  {
    title: "7. Cookies",
    body: `Molino no usa cookies: ni de sesión, ni de rastreo, ni de publicidad. Vercel Web Analytics tampoco. Por eso no hay banner de cookies.`,
  },
  {
    title: "8. Tus derechos",
    body: `Según la ley argentina 25.326, el RGPD y normas similares, podés pedir acceso, rectificación o supresión de tus datos, y oponerte a su tratamiento.

- **Lo que está en tu navegador** lo controlás vos: borrá los datos del sitio y desaparece.
- **Lo que está en nuestros servidores** (hash de compra, lecturas guardadas): escribinos a **${CONTACTO}** con tu ID de pago y lo borramos. Ojo: borrarlo significa perder el acceso Pro.

Respondemos dentro de los 30 días. Podés reclamar ante la AAIP (Argentina), la AEPD (España) o la autoridad de protección de datos de tu país.`,
  },
  {
    title: "9. Menores de edad",
    body: `Molino no está dirigido a menores de 16 años. Si un adulto responsable detecta que un menor nos dio datos, puede escribirnos a ${CONTACTO} y los borramos.`,
  },
  {
    title: "10. Cambios",
    body: `Si esta política cambia, publicamos acá la versión nueva con su fecha. El historial completo de cambios está en el repositorio público del proyecto: https://github.com/Morpheus3232/molino`,
  },
  {
    title: "11. Contacto",
    body: `Para cualquier consulta sobre privacidad, pagos o seguridad: **${CONTACTO}**`,
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
            Última actualización: 4 de octubre de 2026
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
                <div className="text-foreground/70 leading-relaxed text-sm">
                  <LegalText body={section.body} />
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
