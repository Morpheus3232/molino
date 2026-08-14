const CACHE_NAME = 'molino-cache-v3';
const STATIC = ['/offline.html','/manifest.json','/favicon.svg','/favicon.ico','/apple-touch-icon.svg','/icon-192.svg','/icon-512.svg'];
const OPEN = () => caches.open(CACHE_NAME);

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
