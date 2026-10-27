import { useL, type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import LegalText from "@/components/legal/LegalText";

const CONTACTO = "versionlimitada@proton.me";

const sections = (L: Pick2) => ([
  {
    title: L("1. Datos que pedimos", "1. Data we ask for"),
    body: L(`Molino funciona con lo mínimo:

- **Fecha de nacimiento** (obligatoria): con ella se calcula tu mapa, en tu navegador.
- **Nombre** (opcional): solo si lo cargás. Se usa para personalizar el texto.
- **País** (opcional): ordena qué entidades ves primero en tu mapa.

No hay cuentas, contraseñas ni registro. Tu perfil vive en el almacenamiento local de tu navegador (localStorage) y no lo mandamos a nuestros servidores salvo en los casos de la sección 3.`, "Molino works with the bare minimum:\n\n- **Date of birth** (required): your map is calculated from it, in your browser.\n- **Name** (optional): only if you enter it. It's used to personalize the text.\n- **Country** (optional): it sets which entities you see first in your map.\n\nThere are no accounts, passwords or sign-up. Your profile lives in your browser's local storage (localStorage) and we don't send it to our servers except in the cases described in section 3."),
  },
  {
    title: L("2. Qué queda solo en tu navegador", "2. What stays only in your browser"),
    body: L(`- Tu perfil (fecha, nombre y país si los diste) y los mapas que guardes.
- Un identificador aleatorio de dispositivo (\`molino-profile-salt\`), que se mezcla con tus datos para que tu hash sea único.
- Si comprás la Lectura Pro: un token de acceso de este dispositivo y una copia de tu lectura.
- Eventos de uso (\`molino-analytics-events\`): qué páginas abrís y qué funciones usás, con fecha y hora. Nunca tu fecha de nacimiento, nombre, país ni ningún dato de tu mapa. No salen de tu navegador; los podés ver y borrar en \`/analytics\`.
- Una copia de páginas del sitio (service worker) para que cargue más rápido.

Todo esto se borra cuando limpiás los datos del sitio en tu navegador.`, "- Your profile (date, name and country if you gave them) and the maps you save.\n- A random device identifier (`molino-profile-salt`), which is mixed with your data so that your hash is unique.\n- If you buy the Pro Reading: an access token for this device and a copy of your reading.\n- Usage events (`molino-analytics-events`): which pages you open and which features you use, with date and time. Never your date of birth, name, country or any data from your map. They don't leave your browser; you can see and delete them at `/analytics`.\n- A copy of the site's pages (service worker) so it loads faster.\n\nAll of this is deleted when you clear the site's data in your browser."),
  },
  {
    title: L("3. Qué llega a nuestros servidores", "3. What reaches our servers"),
    body: L(`**Visitas (Vercel Web Analytics):** contamos visitas de forma agregada: página, país, tipo de dispositivo, navegador y sitio de origen. No usa cookies ni guarda tu IP; el identificador de visitante es un hash que se descarta cada día. No hay perfil por persona.

**Compra de la Lectura Pro:** guardamos un hash HMAC-SHA256 de tu nombre normalizado, tu fecha y el identificador de dispositivo. Sin nuestra clave no se puede revertir a tus datos. Junto al hash guardamos: el identificador de dispositivo (para que puedas recuperar la compra desde otro equipo), el ID de pago, un token de acceso (vence a los 180 días y se renueva solo) y las lecturas generadas por IA. Se conserva mientras tengas acceso: es lo que te permite recuperarlo.

**Lecturas con IA (solo Lectura Pro):** el servidor arma tu perfil simbólico (signos, números y elementos derivados de tu fecha, más tu nombre si lo diste) y lo envía al proveedor de IA junto con tus preguntas del chat. No se envía tu fecha de nacimiento completa.

**Compartir tu perfil:** si usás "compartir", tu nombre y fecha se guardan 24 horas bajo un enlace aleatorio para que quien lo abra vea tu mapa. Después se borran solos.

**Regalos:** el código, el ID de pago y si ya fue canjeado (y el hash de quien lo canjeó). Un código sin canjear vence a los 30 días.

**Pago con Bitcoin:** recibimos el ID de la transacción que pegás. Lo verificamos contra la blockchain pública y queda registrado para que no se use dos veces.

**Registros técnicos:** Vercel registra cada pedido al servidor (IP, navegador, página) para operar y proteger el sitio.`, "**Visits (Vercel Web Analytics):** we count visits in aggregate: page, country, device type, browser and referring site. It doesn't use cookies or store your IP; the visitor identifier is a hash that's discarded every day. There's no per-person profile.\n\n**Buying the Pro Reading:** we store an HMAC-SHA256 hash of your normalized name, your date and the device identifier. Without our key it can't be reversed back to your data. Along with the hash we store: the device identifier (so you can recover the purchase from another device), the payment ID, an access token (it expires after 180 days and renews automatically) and the AI-generated readings. It's kept for as long as you have access: that's what lets you recover it.\n\n**AI readings (Pro Reading only):** the server builds your symbolic profile (signs, numbers and elements derived from your date, plus your name if you gave it) and sends it to the AI provider along with your chat questions. Your full date of birth is not sent.\n\n**Sharing your profile:** if you use \"share\", your name and date are stored for 24 hours under a random link so that whoever opens it can see your map. After that they're deleted automatically.\n\n**Gifts:** the code, the payment ID and whether it has been redeemed (and the hash of whoever redeemed it). An unredeemed code expires after 30 days.\n\n**Bitcoin payment:** we receive the transaction ID you paste. We verify it against the public blockchain and it's recorded so it can't be used twice.\n\n**Technical logs:** Vercel logs every request to the server (IP, browser, page) to operate and protect the site."),
  },
  {
    title: L("4. Proveedores", "4. Providers"),
    body: L(`| Proveedor | Para qué | Qué recibe |
|-----------|----------|------------|
| Vercel | Hosting, registros técnicos, Web Analytics | Pedidos al sitio; visitas agregadas sin cookies |
| Upstash (base de datos de Vercel) | Guardar lo descripto en la sección 3 | Hashes, IDs de pago, perfiles compartidos por 24 h |
| Mercado Pago | Cobro de la Lectura Pro | Lo que cargás en su checkout (email, medio de pago); de nosotros: hash del perfil, producto y monto |
| Resend | Email de confirmación de compra | Tu email (el que diste en Mercado Pago) y el ID de pago |
| OpenRouter | Lecturas con IA (Pro) | Perfil simbólico, nombre si lo diste, preguntas del chat. Lo envía al proveedor del modelo configurado |
| mempool.space | Verificar pagos con Bitcoin y cotizar | Solo el ID de transacción; la consulta la hace nuestro servidor, no tu navegador |
| Wikimedia | Imágenes de las entidades del Atlas | Tu navegador las descarga de upload.wikimedia.org: Wikimedia ve tu IP y navegador, como en cualquier imagen externa |

Cada proveedor trata los datos según su propia política de privacidad. No usamos Google Analytics, píxeles de redes sociales ni ningún otro servicio de rastreo.`, "| Provider | What for | What it receives |\n|-----------|----------|------------|\n| Vercel | Hosting, technical logs, Web Analytics | Requests to the site; aggregated cookieless visits |\n| Upstash (Vercel's database) | Storing what's described in section 3 | Hashes, payment IDs, profiles shared for 24 h |\n| Mercado Pago | Charging for the Pro Reading | What you enter in its checkout (email, payment method); from us: profile hash, product and amount |\n| Resend | Purchase confirmation email | Your email (the one you gave Mercado Pago) and the payment ID |\n| OpenRouter | AI readings (Pro) | Symbolic profile, name if you gave it, chat questions. It sends them to the configured model's provider |\n| mempool.space | Verifying Bitcoin payments and quoting prices | Only the transaction ID; the query is made by our server, not your browser |\n| Wikimedia | Images of Atlas entities | Your browser downloads them from upload.wikimedia.org: Wikimedia sees your IP and browser, as with any external image |\n\nEach provider handles data according to its own privacy policy. We don't use Google Analytics, social media pixels or any other tracking service."),
  },
  {
    title: L("5. Para qué los usamos y base legal", "5. What we use them for and legal basis"),
    body: L(`- Calcular tu mapa y mostrártelo (se hace en tu navegador).
- Cobrar y darte acceso a la Lectura Pro: ejecución del contrato.
- Generar tus lecturas con IA: ejecución del contrato.
- Medir visitas en forma agregada y anónima, y mantener el sitio seguro: interés legítimo.

No vendemos datos, no hacemos publicidad ni marketing y no tomamos decisiones automatizadas con efecto legal sobre vos.`, "- Calculating your map and showing it to you (done in your browser).\n- Charging and giving you access to the Pro Reading: performance of the contract.\n- Generating your AI readings: performance of the contract.\n- Measuring visits in an aggregated, anonymous way, and keeping the site secure: legitimate interest.\n\nWe don't sell data, we don't do advertising or marketing, and we don't make automated decisions with legal effect on you."),
  },
  {
    title: L("6. Seguridad", "6. Security"),
    body: L(`- HTTPS obligatorio, con HSTS.
- Content Security Policy que limita de dónde se cargan scripts, imágenes y marcos.
- Headers de seguridad: X-Frame-Options, Referrer-Policy, X-Content-Type-Options y Permissions-Policy.
- Sin contraseñas que robar: no hay cuentas.
- El acceso Pro exige un token que solo tiene el dispositivo que compró; con tu nombre y fecha no alcanza.`, "- HTTPS required, with HSTS.\n- A Content Security Policy that limits where scripts, images and frames can be loaded from.\n- Security headers: X-Frame-Options, Referrer-Policy, X-Content-Type-Options and Permissions-Policy.\n- No passwords to steal: there are no accounts.\n- Pro access requires a token that only the purchasing device has; your name and date aren't enough."),
  },
  {
    title: "7. Cookies",
    body: L(`Molino no usa cookies: ni de sesión, ni de rastreo, ni de publicidad. Vercel Web Analytics tampoco. Por eso no hay banner de cookies.`, "Molino doesn't use cookies: no session cookies, no tracking cookies, no advertising cookies. Neither does Vercel Web Analytics. That's why there's no cookie banner."),
  },
  {
    title: L("8. Tus derechos", "8. Your rights"),
    body: L(`Según la ley argentina 25.326, el RGPD y normas similares, podés pedir acceso, rectificación o supresión de tus datos, y oponerte a su tratamiento.

- **Lo que está en tu navegador** lo controlás vos: borrá los datos del sitio y desaparece.
- **Lo que está en nuestros servidores** (hash de compra, lecturas guardadas): escribinos a **${CONTACTO}** con tu ID de pago y lo borramos. Ojo: borrarlo significa perder el acceso Pro.

Respondemos dentro de los 30 días. Podés reclamar ante la AAIP (Argentina), la AEPD (España) o la autoridad de protección de datos de tu país.`, `Under Argentine Law 25,326, the GDPR and similar regulations, you can request access to, rectification or deletion of your data, and object to its processing.\n\n- **What's in your browser** is under your control: clear the site's data and it's gone.\n- **What's on our servers** (purchase hash, saved readings): write to us at **${CONTACTO}** with your payment ID and we'll delete it. Note: deleting it means losing Pro access.\n\nWe reply within 30 days. You can file a complaint with the AAIP (Argentina), the AEPD (Spain) or the data protection authority in your country.`),
  },
  {
    title: L("9. Menores de edad", "9. Minors"),
    body: L(`Molino no está dirigido a menores de 16 años. Si un adulto responsable detecta que un menor nos dio datos, puede escribirnos a ${CONTACTO} y los borramos.`, `Molino is not intended for anyone under 16. If a responsible adult finds that a minor has given us data, they can write to us at ${CONTACTO} and we'll delete it.`),
  },
  {
    title: L("10. Cambios", "10. Changes"),
    body: L(`Si esta política cambia, publicamos acá la versión nueva con su fecha. El historial completo de cambios está en el repositorio público del proyecto: https://github.com/Morpheus3232/molino`, "If this policy changes, we publish the new version here with its date. The full change history is in the project's public repository: https://github.com/Morpheus3232/molino"),
  },
  {
    title: L("11. Contacto", "11. Contact"),
    body: L(`Para cualquier consulta sobre privacidad, pagos o seguridad: **${CONTACTO}**`, `For any question about privacy, payments or security: **${CONTACTO}**`),
  },
]);

export default function PrivacidadContent() {
  const L = useL();
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="container-content py-16 sm:py-24 max-w-3xl mx-auto">
        <div>
          <nav className="flex items-center gap-2 text-xs text-muted mb-8" aria-label="Breadcrumb">{L(<>
            <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Privacidad</span>
          </>, <><Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Home</Link><span>›</span><span className="text-foreground font-medium">Privacy</span></>)}</nav>

          <h1
            className="page-title text-foreground mb-4 animate-fade-in-up"
          >{L("Política de Privacidad", "Privacy Policy")}</h1>
          <p className="text-muted mb-2 text-sm animate-fade-in-up stagger-1">{L("Última actualización: 4 de octubre de 2026", "Last updated: October 4, 2026")}</p>
          <p className="text-foreground/70 mb-12 leading-relaxed animate-fade-in-up stagger-2">{L("En Molino, tu privacidad es una prioridad. Esta política describe cómo recopilamos, usamos y protegemos tu información cuando utilizás nuestra plataforma.", "At Molino, your privacy is a priority. This policy describes how we collect, use and protect your information when you use our platform. This English version is provided for convenience; in case of any discrepancy, the Spanish version prevails.")}</p>

          <div className="space-y-10">
            {sections(L).map((section, i) => (
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

          <div className="text-center border-t border-ink/10 pt-16 mt-10">{L(<>
            <Link
              href="/"
              className="text-sm font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent transition-colors"
            >
              Volver al inicio
            </Link>
          </>, <><Link href="/" className="text-sm font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent transition-colors">Back to home</Link></>)}</div>
        </div>
      </div>
    </main>
  );
}
