const CACHE = "trening-v4";
const PLIKI = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.allSettled(PLIKI.map(p => c.add(p))))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const klucze = await caches.keys();
    await Promise.all(klucze.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const kopia = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, kopia));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});