const NOMBRE_CACHE = "liquiruta-v5";

const ARCHIVOS_A_GUARDAR = [
  "./",
  "index.html",
  "nueva-ruta.html",
  "ruta.html",
  "registro-facturas.html",
  "gastos.html",
  "notas.html",
  "conteo-billetes.html",
  "liquidacion-final.html",
  "editar-ruta.html",
  "historial.html",
  "descuento.html",
  "css/estilos.css",
  "js/core.js",
  "js/db.js",
  "js/logo.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (evento) => {
  self.skipWaiting();
  evento.waitUntil(
    caches.open(NOMBRE_CACHE).then((cache) => cache.addAll(ARCHIVOS_A_GUARDAR))
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== NOMBRE_CACHE)
          .map((nombre) => caches.delete(nombre))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request, { ignoreSearch: true }).then((respuestaGuardada) => {
      return respuestaGuardada || fetch(evento.request);
    })
  );
});
