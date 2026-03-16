const CACHE_NAME = "girlboss-pwa-v1";
const STATIC_ASSETS = [
  "/",
  "/urunler",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-icon.png",
  "/favicon.ico",
  "/og-image.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Sadece aynı origin'den gelen istekleri handle et
  if (!request.url.startsWith(self.location.origin)) return;

  // POST/PUT/DELETE isteklerini cache'leme
  if (request.method !== "GET") return;

  // Navigasyon istekleri: network-first, offline'da cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
    return;
  }

  // Statik assetler: cache-first, sonra network
  event.respondWith(
    caches.match(request).then(
      (cached) => cached || fetch(request).then((response) => {
        // Sadece başarılı yanıtları cache'le
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
    )
  );
});
