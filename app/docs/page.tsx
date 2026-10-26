import Link from "next/link";
import { PageHero, Columns } from "@/components/knowledge/Kit";
import { siteUrl, SITE_URL, createRouteMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export const metadata = createRouteMetadata({
  title: "API Pública & Documentación para Desarrolladores",
  description:
    "Documentación completa de la API REST v1 de Molino. Endpoints con soporte CORS para consultar mapas simbólicos, compatibilidad y energía diaria en JSON.",
  path: "/docs",
});

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/map",
    title: "Mapa Personal Completo",
    desc: "Calcula Camino de Vida, signo solar, animal del zodíaco chino y ciclos anuales.",
    params: [
      { name: "date", type: "string (YYYY-MM-DD)", required: true, desc: "Fecha de nacimiento (ej: 1990-03-15)" },
      { name: "name", type: "string", required: false, desc: "Nombre opcional del consultante" },
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
    title: "Energía & Foco Diario",
    desc: "Calcula la vibración diaria, fase lunar, áreas de foco y recomendaciones.",
    params: [
      { name: "birthDate", type: "string (YYYY-MM-DD)", required: true, desc: "Fecha de nacimiento" },
      { name: "targetDate", type: "string (YYYY-MM-DD)", required: false, desc: "Fecha a consultar (default: hoy)" },
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
    title: "Compatibilidad & Sinastría",
    desc: "Cruza dos mapas para obtener puntuación de sinastría, conexiones y desafíos.",
    params: [
      { name: "dateA", type: "string (YYYY-MM-DD)", required: true, desc: "Fecha nacimiento persona A" },
      { name: "dateB", type: "string (YYYY-MM-DD)", required: true, desc: "Fecha nacimiento persona B" },
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
];

export default function DocsPage() {
  return (
    <main id="main-content" className="bg-background pt-12 sm:pt-16 pb-24 text-foreground">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <PageHero
          bare
          crumbs={[{ href: "/", label: "Inicio" }, { label: "API" }]}
          eyebrow="Desarrolladores · API v1"
          title="La API pública de Molino"
          lead="El mismo motor de cálculo de la app, para tus aplicaciones, bots o sitios. Gratis, con CORS abierto y sin registro."
          aside={
            <div className="border-2 border-ink">
              <p className="px-5 py-3 border-b border-ink/15 text-sm text-muted">Una consulta de ejemplo</p>
              <pre className="p-5 text-sm sm:text-base font-mono text-foreground overflow-x-auto leading-relaxed bg-paper-alt/60">
                <code>{`curl "${SITE_URL}/api/v1/map?date=1990-03-15"

"map": {
  "numerology": { "lifePath": 1 },
  "astrology": { "sunSign": "Piscis" },
  "chineseZodiac": { "animal": "Caballo" },
  ...
}`}</code>
              </pre>
            </div>
          }
        />

        <div className="mb-16">
          <Columns
            cols={[
              { title: "Sin guardado", body: "Las consultas no guardan estado: no persistimos fechas ni identificadores en servidores." },
              { title: "CORS abierto", body: "Se consume directo desde el navegador con fetch, o desde backends en Node o Python." },
              { title: "Determinista", body: "Los mismos parámetros devuelven siempre exactamente el mismo resultado." },
            ]}
          />
        </div>

        <h2 className="section-title text-foreground mb-8">Endpoints</h2>
        {/* Endpoints List */}
        <div className="space-y-12 mb-16">
          {ENDPOINTS.map((ep) => (
            <div
              key={ep.path}
              id={ep.path.replace(/[/]/g, "-")}
              className="p-6 sm:p-8 border-2 border-ink bg-background space-y-6 scroll-mt-24"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink/10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-foreground">
                    {ep.path}
                  </span>
                </div>
                <span className="font-heading text-sm text-accent font-semibold">
                  {ep.title}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {ep.desc}
              </p>

              {/* Parameters Table */}
              <div>
                <h4 className="text-sm text-foreground font-bold mb-3 label-caps">
                  Parámetros de consulta (Query Params)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-ink/10 text-muted">
                        <th className="py-2 pr-4">Parámetro</th>
                        <th className="py-2 pr-4">Tipo</th>
                        <th className="py-2 pr-4">Requerido</th>
                        <th className="py-2">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {ep.params.map((p) => (
                        <tr key={p.name}>
                          <td className="py-2.5 pr-4 font-bold text-accent">{p.name}</td>
                          <td className="py-2.5 pr-4 text-muted">{p.type}</td>
                          <td className="py-2.5 pr-4">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                p.required
                                  ? "bg-amber-500/10 text-amber-700"
                                  : "bg-ink/5 text-muted"
                              }`}
                            >
                              {p.required ? "Sí" : "Opcional"}
                            </span>
                          </td>
                          <td className="py-2.5 text-muted">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example Request & Response */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">Ejemplo de respuesta (JSON):</span>
                  <a
                    href={ep.example}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1"
                  >
                    Probar en vivo <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <pre className="p-4 rounded-lg bg-background border border-ink/10 text-[11px] font-mono text-foreground/90 overflow-x-auto leading-relaxed">
                  <code>{ep.response}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        <Link href="/docs/motores" className="group block border-t-2 border-ink pt-6">
          <span className="block text-sm text-muted label-caps">Fórmulas y algoritmos</span>
          <span className="mt-2 block font-display text-3xl text-foreground group-hover:underline underline-offset-[5px]">Cómo funcionan los motores de cálculo</span>
          <span className="mt-2 block text-lg text-muted">Swiss Ephemeris, la reducción pitagórica y el ciclo sexagenario, paso a paso.</span>
        </Link>
      </div>
    </main>
  );
}
