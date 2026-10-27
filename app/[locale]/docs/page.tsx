import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import { PageHero, Columns } from "@/components/knowledge/Kit";
import { siteUrl, SITE_URL, metadataFor } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export const generateMetadata = metadataFor({
  title: ["API Pública & Documentación para Desarrolladores", "Public API & Developer Documentation"],
  description:
    ["Documentación completa de la API REST v1 de Molino. Endpoints con soporte CORS para consultar mapas simbólicos, compatibilidad y energía diaria en JSON.", "Complete documentation for Molino's REST API v1. CORS-enabled endpoints to query symbolic maps, compatibility and daily energy in JSON."],
  path: "/docs",
});

const ENDPOINTS = (L: Pick2) => ([
  {
    method: "GET",
    path: "/api/v1/map",
    title: L("Mapa Personal Completo", "Complete Personal Map"),
    desc: L("Calcula Camino de Vida, signo solar, animal del zodíaco chino y ciclos anuales.", "Calculates the Life Path, sun sign, Chinese zodiac animal and yearly cycles."),
    params: [
      { name: "date", type: "string (YYYY-MM-DD)", required: true, desc: L("Fecha de nacimiento (ej: 1990-03-15)", "Date of birth (e.g. 1990-03-15)") },
      { name: "name", type: "string", required: false, desc: L("Nombre opcional del consultante", "Optional name of the person being read") },
    ],
    example: `${SITE_URL}/api/v1/map?date=1990-03-15&name=Ana`,
    response: `{
  "status": "success",
  "query": { "date": "1990-03-15", "name": "Ana" },
  "map": {
    "numerology": { "lifePath": 1, "archetype": "El Iniciador" },
    "astrology": { "sunSign": "Piscis", "element": "Agua" },
    "chineseZodiac": { "animal": "Caballo", "element": "Metal" },
    "cycles": { "personalYear": 9, "personalDay": 1 }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/daily",
    title: L("Energía & Foco Diario", "Daily Energy & Focus"),
    desc: L("Calcula la vibración diaria, fase lunar, áreas de foco y recomendaciones.", "Calculates the daily vibration, moon phase, focus areas and recommendations."),
    params: [
      { name: "birthDate", type: "string (YYYY-MM-DD)", required: true, desc: L("Fecha de nacimiento", "Date of birth") },
      { name: "targetDate", type: "string (YYYY-MM-DD)", required: false, desc: L("Fecha a consultar (default: hoy)", "Date to query (default: today)") },
    ],
    example: `${SITE_URL}/api/v1/daily?birthDate=1990-03-15`,
    response: `{
  "status": "success",
  "dailyEnergy": {
    "personalDay": 1,
    "theme": "Iniciación",
    "moonPhase": { "phase": "Luna Nueva", "emoji": "🌑" },
    "areas": { "work": { "score": 85 }, "creativity": { "score": 90 } }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/compatibility",
    title: L("Compatibilidad & Sinastría", "Compatibility & Synastry"),
    desc: L("Cruza dos mapas para obtener puntuación de sinastría, conexiones y desafíos.", "Crosses two maps to get a synastry score, connections and challenges."),
    params: [
      { name: "dateA", type: "string (YYYY-MM-DD)", required: true, desc: L("Fecha nacimiento persona A", "Date of birth of person A") },
      { name: "dateB", type: "string (YYYY-MM-DD)", required: true, desc: L("Fecha nacimiento persona B", "Date of birth of person B") },
    ],
    example: `${SITE_URL}/api/v1/compatibility?dateA=1990-03-15&dateB=1988-07-22`,
    response: `{
  "status": "success",
  "compatibility": {
    "score": 88,
    "level": "Alta Resonancia",
    "summary": "Excelente equilibrio entre agua y fuego.",
    "connections": [...]
  }
}`,
  },
]);

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <main id="main-content" className="bg-background pt-12 sm:pt-16 pb-24 text-foreground">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <PageHero
          bare
          crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: "API" }]}
          eyebrow={L("Desarrolladores · API v1", "Developers · API v1")}
          title={L("La API pública de Molino", "Molino's public API")}
          lead={L("El mismo motor de cálculo de la app, para tus aplicaciones, bots o sitios. Gratis, con CORS abierto y sin registro.", "The same calculation engine as the app, for your applications, bots or sites. Free, with open CORS and no sign-up. Responses are in Spanish.")}
          aside={
            <div className="border-2 border-ink">
              <p className="px-5 py-3 border-b border-ink/15 text-sm text-muted">{L("Una consulta de ejemplo", "A sample query")}</p>
              <pre className="p-5 text-sm sm:text-base font-mono text-foreground overflow-x-auto leading-relaxed bg-paper-alt/60">
                <code>{L.t(`curl "${SITE_URL}/api/v1/map?date=1990-03-15"

"map": {
  "numerology": { "lifePath": 1 },
  "astrology": { "sunSign": "Piscis" },
  "chineseZodiac": { "animal": "Caballo" },
  ...
}`)}</code>
              </pre>
            </div>
          }
        />

        <div className="mb-16">
          <Columns
            cols={[
              { title: L("Sin guardado", "Nothing stored"), body: L("Las consultas no guardan estado: no persistimos fechas ni identificadores en servidores.", "Queries are stateless: we don't persist dates or identifiers on servers.") },
              { title: L("CORS abierto", "Open CORS"), body: L("Se consume directo desde el navegador con fetch, o desde backends en Node o Python.", "Call it directly from the browser with fetch, or from Node or Python backends.") },
              { title: L("Determinista", "Deterministic"), body: L("Los mismos parámetros devuelven siempre exactamente el mismo resultado.", "The same parameters always return exactly the same result.") },
            ]}
          />
        </div>

        <h2 className="section-title text-foreground mb-8">Endpoints</h2>
        {/* Endpoints List */}
        <div className="space-y-12 mb-16">
          {ENDPOINTS(L).map((ep) => (
            <div
              key={ep.path}
              id={ep.path.replace(/[/]/g, "-")}
              className="p-6 sm:p-8 border-2 border-ink bg-background space-y-6 scroll-mt-24"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink/10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {L.t(ep.method)}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-foreground">
                    {L.t(ep.path)}
                  </span>
                </div>
                <span className="font-heading text-sm text-accent font-semibold">
                  {L.t(ep.title)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {L.t(ep.desc)}
              </p>

              {/* Parameters Table */}
              <div>
                <h4 className="text-sm text-foreground font-bold mb-3 label-caps">{L("Parámetros de consulta (Query Params)", "Query parameters (Query Params)")}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-ink/10 text-muted">
                        <th className="py-2 pr-4">{L("Parámetro", "Parameter")}</th>
                        <th className="py-2 pr-4">{L("Tipo", "Type")}</th>
                        <th className="py-2 pr-4">{L("Requerido", "Required")}</th>
                        <th className="py-2">{L("Descripción", "Description")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {ep.params.map((p) => (
                        <tr key={p.name}>
                          <td className="py-2.5 pr-4 font-bold text-accent">{L.t(p.name)}</td>
                          <td className="py-2.5 pr-4 text-muted">{L.t(p.type)}</td>
                          <td className="py-2.5 pr-4">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                p.required
                                  ? "bg-amber-500/10 text-amber-700"
                                  : "bg-ink/5 text-muted"
                              }`}
                            >
                              {L.t(p.required ? L("Sí", "Yes") : L("Opcional", "Optional"))}
                            </span>
                          </td>
                          <td className="py-2.5 text-muted">{L.t(p.desc)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example Request & Response */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">{L("Ejemplo de respuesta (JSON):", "Sample response (JSON):")}</span>
                  <a
                    href={ep.example}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1"
                  >
                    {L("Probar en vivo ", "Try it live ")} <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <pre className="p-4 rounded-lg bg-background border border-ink/10 text-[11px] font-mono text-foreground/90 overflow-x-auto leading-relaxed">
                  <code>{L.t(ep.response)}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        <Link href="/docs/motores" className="group block border-t-2 border-ink pt-6">{L(<>
          <span className="block text-sm text-muted label-caps">Fórmulas y algoritmos</span>
          <span className="mt-2 block font-display text-3xl text-foreground group-hover:underline underline-offset-[5px]">Cómo funcionan los motores de cálculo</span>
          <span className="mt-2 block text-lg text-muted">Swiss Ephemeris, la reducción pitagórica y el ciclo sexagenario, paso a paso.</span>
        </>, <><span className="block text-sm text-muted label-caps">Formulas and algorithms</span><span className="mt-2 block font-display text-3xl text-foreground group-hover:underline underline-offset-[5px]">How the calculation engines work</span><span className="mt-2 block text-lg text-muted">Swiss Ephemeris, Pythagorean reduction and the sexagenary cycle, step by step.</span></>)}</Link>
      </div>
    </main>
  );
}
