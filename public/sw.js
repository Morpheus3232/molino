const CACHE_NAME = 'molino-cache-v2';
const PRECACHE = ['/', '/offline.html', '/manifest.json', '/favicon.svg', '/favicon.ico', '/apple-touch-icon.svg', '/icon-192.svg', '/icon-512.svg', '/hoy', '/profile', '/pareja', '/journal', '/onboarding'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE)));
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

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).then((res) => {
        if (res && res.status === 200) { const c = res.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, c)); }
        return res;
      }).catch(async () => (await caches.match(request)) || caches.match('/offline.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((res) => {
        if (res && res.status === 200) { const c = res.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, c)); }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
