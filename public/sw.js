const CACHE_NAME = 'molino-cache-v5';
const STATIC = ['/offline.html','/manifest.json','/favicon.svg','/favicon.ico','/apple-touch-icon.svg','/icon-192.svg','/icon-512.svg'];
const OPEN = () => caches.open(CACHE_NAME);

// Next.js App Router client-side navigation (click en <Link>, prefetch) no
// dispara request.mode === 'navigate' — es un fetch same-origin normal con
// estos headers. Si cae en el handler stale-while-revalidate de abajo, una
// sección puede quedar sirviendo un payload RSC viejo (de una sesión o build
// anterior) hasta que el usuario hace un refresh real. Debe ir siempre a red.
const isNextRouterRequest = (request) =>
  request.headers.get('RSC') === '1' ||
  request.headers.get('Next-Router-State-Tree') !== null ||
  request.headers.get('Next-Router-Prefetch') !== null;

self.addEventListener('install', (e) => {
  e.waitUntil(OPEN().then((c) => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then((list) => {
    for (const c of list) { if (c.url && 'focus' in c) { c.navigate('/hoy'); return c.focus(); } }
    if (clients.openWindow) return clients.openWindow('/hoy');
  }));
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  // Network-first for navigations (fresh HTML + hashed chunks after deploy), offline fallback
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => { if (res && res.status === 200) { const c = res.clone(); OPEN().then((cache) => cache.put(request, c)); } return res; })
        .catch(async () => (await caches.match(request)) || (await caches.match('/offline.html')) || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } }))
    );
    return;
  }

  // Next.js router fetches (RSC payloads for client-side navigation and
  // prefetch) — same-origin, never request.mode 'navigate', but must stay
  // network-only. See isNextRouterRequest above.
  if (isNextRouterRequest(request)) {
    e.respondWith(fetch(request));
    return;
  }

  // Cache-first for immutable hashed Next.js static assets
  if (url.pathname.startsWith('/_next/static/')) {
    e.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        if (res && res.status === 200) { const c = res.clone(); OPEN().then((cache) => cache.put(request, c)); }
        return res;
      }))
    );
    return;
  }

  // Stale-while-revalidate for other same-origin static assets
  e.respondWith(
    caches.match(request).then((cached) => {
      const live = fetch(request).then((res) => {
        if (res && res.status === 200) { const c = res.clone(); OPEN().then((cache) => cache.put(request, c)); }
        return res;
      }).catch(() => cached);
      return cached || live;
    })
  );
});
