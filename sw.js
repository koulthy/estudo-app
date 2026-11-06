// Guarda o app no celular para funcionar sem internet.
const CACHE = "estudo-7d606371";
const FILES = ["./", "index.html", "fonts.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "fonts/bricolage-grotesque-latin-500-normal.woff2", "fonts/bricolage-grotesque-latin-700-normal.woff2", "fonts/bricolage-grotesque-latin-800-normal.woff2", "fonts/bricolage-grotesque-latin-ext-500-normal.woff2", "fonts/bricolage-grotesque-latin-ext-700-normal.woff2", "fonts/bricolage-grotesque-latin-ext-800-normal.woff2", "fonts/ibm-plex-sans-latin-400-normal.woff2", "fonts/ibm-plex-sans-latin-500-normal.woff2", "fonts/ibm-plex-sans-latin-600-normal.woff2", "fonts/ibm-plex-sans-latin-ext-400-normal.woff2", "fonts/ibm-plex-sans-latin-ext-500-normal.woff2", "fonts/ibm-plex-sans-latin-ext-600-normal.woff2", "fonts/jetbrains-mono-latin-500-normal.woff2", "fonts/jetbrains-mono-latin-700-normal.woff2", "fonts/jetbrains-mono-latin-ext-500-normal.woff2", "fonts/jetbrains-mono-latin-ext-700-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.mode === "navigate") {
    // página: tenta a versão nova, e sem internet usa a guardada
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
