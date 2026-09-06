const NOMBRE_DB = "liquidacion_rutas";
const VERSION_DB = 1;

function abrirDB() {
  return new Promise((resolve, reject) => {
    const solicitud = indexedDB.open(NOMBRE_DB, VERSION_DB);

    solicitud.onupgradeneeded = (evento) => {
      const db = evento.target.result;

      const rutas = db.createObjectStore("rutas", { keyPath: "id", autoIncrement: true });
      rutas.createIndex("porId", "id");

      const facturas = db.createObjectStore("facturas", { keyPath: "id", autoIncrement: true });
      facturas.createIndex("porRuta", "rutaId");

      const gastos = db.createObjectStore("gastos", { keyPath: "id", autoIncrement: true });
      gastos.createIndex("porRuta", "rutaId");

      const notas = db.createObjectStore("notas", { keyPath: "id", autoIncrement: true });
      notas.createIndex("porRuta", "rutaId");

      const conteoBilletes = db.createObjectStore("conteoBilletes", { keyPath: "id", autoIncrement: true });
      conteoBilletes.createIndex("porRuta", "rutaId");
    };

    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject(solicitud.error);
  });
}

function conStore(nombreStore, modo, funcion) {
  return abrirDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaccion = db.transaction(nombreStore, modo);
      const store = transaccion.objectStore(nombreStore);
      const resultado = funcion(store);
      transaccion.oncomplete = () => resolve(resultado);
      transaccion.onerror = () => reject(transaccion.error);
    });
  });
}

const RutaDao = {
  insertarRuta(ruta) {
    return abrirDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaccion = db.transaction("rutas", "readwrite");
        const store = transaccion.objectStore("rutas");
        const solicitud = store.add(ruta);
        solicitud.onsuccess = () => resolve(solicitud.result);
        solicitud.onerror = () => reject(solicitud.error);
      });
    });
  },

  actualizarRuta(ruta) {
    return conStore("rutas", "readwrite", (store) => store.put(ruta));
  },

  eliminarRuta(id) {
    return conStore("rutas", "readwrite", (store) => store.delete(id));
  },

  obtenerTodasLasRutas() {
    return abrirDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaccion = db.transaction("rutas", "readonly");
        const store = transaccion.objectStore("rutas");
        const solicitud = store.getAll();
        solicitud.onsuccess = () => resolve(solicitud.result.reverse());
        solicitud.onerror = () => reject(solicitud.error);
      });
    });
  },

  obtenerRuta(id) {
    return abrirDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaccion = db.transaction("rutas", "readonly");
        const store = transaccion.objectStore("rutas");
        const solicitud = store.get(id);
        solicitud.onsuccess = () => resolve(solicitud.result);
        solicitud.onerror = () => reject(solicitud.error);
      });
    });
  },

  obtenerPorRuta(nombreStore, rutaId) {
    return abrirDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaccion = db.transaction(nombreStore, "readonly");
        const store = transaccion.objectStore(nombreStore);
        const indice = store.index("porRuta");
        const solicitud = indice.getAll(rutaId);
        solicitud.onsuccess = () => resolve(solicitud.result);
        solicitud.onerror = () => reject(solicitud.error);
      });
    });
  },

  insertarEn(nombreStore, registro) {
    return abrirDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaccion = db.transaction(nombreStore, "readwrite");
        const store = transaccion.objectStore(nombreStore);
        const solicitud = store.add(registro);
        solicitud.onsuccess = () => resolve(solicitud.result);
        solicitud.onerror = () => reject(solicitud.error);
      });
    });
  },

  eliminarDe(nombreStore, id) {
    return conStore(nombreStore, "readwrite", (store) => store.delete(id));
  },

  async obtenerRutaConDetalles(rutaId) {
    const ruta = await this.obtenerRuta(rutaId);
    if (!ruta) return null;
    const facturas = await this.obtenerPorRuta("facturas", rutaId);
    const gastos = await this.obtenerPorRuta("gastos", rutaId);
    const notas = await this.obtenerPorRuta("notas", rutaId);
    const conteoBilletes = await this.obtenerPorRuta("conteoBilletes", rutaId);
    return { ruta, facturas, gastos, notas, conteoBilletes };
  },
};
