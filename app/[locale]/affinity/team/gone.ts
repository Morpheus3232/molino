/**
 * Respuesta 410 para las fichas de equipos de fútbol, que salieron del sitio
 * el 2026-10-20. "Gone" le dice a Google que no van a volver y las saca del
 * índice y de la cola de rastreo; un redirect a otra página no lo hacía.
 */
export function gone(): Response {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Página eliminada · Molino</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="font-family:Georgia,serif;max-width:36rem;margin:15vh auto;padding:0 1rem;color:#0a0a0a"><h1 style="font-weight:400">Esta página ya no existe</h1><p>Los equipos de fútbol salieron del Atlas. Podés seguir explorando las <a href="/affinity">afinidades</a>.</p></body></html>`;
  return new Response(html, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
  });
}
