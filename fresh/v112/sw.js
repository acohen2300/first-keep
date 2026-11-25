// First Keep for when there is no signal (SoRen's sw.js; Albert, Nov 7: it works offline; Nov 8 08:13, B11): online, every file is fetched fresh,
// so a new page never runs beside an old book; each answer is kept, and with no signal the last kept copy serves.
const KEEP = 'first-keep-v100';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => { if (e.request.method !== 'GET') return; e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => { const c = r.clone(); caches.open(KEEP).then((k) => k.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }))); });
