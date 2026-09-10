const NOMBRE_CACHE = "liquiruta-app-v1";

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
  evento.waitUntil(
    caches.open(NOMBRE_CACHE).then((cache) => {
      return cache.addAll(ARCHIVOS_A_GUARDAR);
    })
  );

  self.skipWaiting();
});


self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) => {
      return Promise.all(
        nombres
          .filter((nombre) => nombre !== NOMBRE_CACHE)
          .map((nombre) => caches.delete(nombre))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});


self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") {
    return;
  }

  const url = new URL(evento.request.url);


  if (url.origin !== self.location.origin) {
    return;
  }

  evento.respondWith(
    fetch(evento.request, {
      cache: "no-cache"
    })
      .then((respuesta) => {
        if (respuesta && respuesta.ok) {
          const copia = respuesta.clone();

          caches.open(NOMBRE_CACHE).then((cache) => {
            cache.put(evento.request, copia);
          });
        }

        return respuesta;
      })
      .catch(() => {
        return caches.match(evento.request, {
          ignoreSearch: true
        });
      })
  );
});
