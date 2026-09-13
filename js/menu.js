function inicializarMenuLateral() {
  const parametros = new URLSearchParams(window.location.search);
  const rutaId = parametros.get("id");

  const estilo = document.createElement("style");
  estilo.textContent = `
    .boton-menu {
      background: none;
      border: none;
      color: rgb(238, 129, 5);
      width: auto;
      padding: 4px;
      display: flex;
      align-items: center;
    }
    .panel-lateral {
      position: fixed;
      top: 0;
      left: -280px;
      width: 260px;
      height: 100%;
      background: white;
      box-shadow: 2px 0 10px rgba(0,0,0,0.2);
      transition: left 0.25s ease;
      z-index: 100;
      padding: 20px 0;
      overflow-y: auto;
    }
    .panel-lateral.abierto {
      left: 0;
    }
    .panel-lateral a {
      display: block;
      padding: 12px 20px;
      color: #1a1a1a;
      text-decoration: none;
      font-size: 15px;
    }
    .panel-lateral a.activo {
      background: #f0f2fa;
      color: #1A2B6A;
      font-weight: 600;
      border-left: 4px solid #FF7515;
    }
    .panel-lateral .seccion {
      font-size: 12px;
      color: #999;
      padding: 14px 20px 6px;
      text-transform: uppercase;
    }
    .fondo-oscuro {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 99;
    }
    .fondo-oscuro.abierto {
      display: block;
    }
  `;
  document.head.appendChild(estilo);

  const pagina = window.location.pathname.split("/").pop();

  let enlacesRuta = "";
  if (rutaId) {
    enlacesRuta = `
      <p class="seccion">Ruta en curso</p>
      <a href="ruta.html?id=${rutaId}" data-pagina="ruta.html">Menú de la ruta</a>
      <a href="registro-facturas.html?id=${rutaId}" data-pagina="registro-facturas.html">Registro de facturas</a>
      <a href="transferencias.html?id=${rutaId}" data-pagina="transferencias.html">Pagos por transferencia</a>
      <a href="gastos.html?id=${rutaId}" data-pagina="gastos.html">Gastos</a>
      <a href="notas.html?id=${rutaId}" data-pagina="notas.html">Notas de facturas</a>
      <a href="conteo-billetes.html?id=${rutaId}" data-pagina="conteo-billetes.html">Conteo de billetes</a>
      <a href="editar-ruta.html?id=${rutaId}" data-pagina="editar-ruta.html">Editar datos de la ruta</a>
      <a href="liquidacion-final.html?id=${rutaId}" data-pagina="liquidacion-final.html">Liquidación final</a>
    `;
  }

  const panel = document.createElement("div");
  panel.innerHTML = `
    <div class="fondo-oscuro" id="fondoMenu"></div>
    <div class="panel-lateral" id="panelMenu">
      <p class="seccion">General</p>
      <a href="index.html" data-pagina="index.html">Inicio</a>
      <a href="nueva-ruta.html" data-pagina="nueva-ruta.html">Nueva ruta</a>
      <a href="historial.html" data-pagina="historial.html">Historial de rutas</a>
      <a href="descuento.html" data-pagina="descuento.html">Descuento de productos</a>
      ${enlacesRuta}
    </div>
  `;
  document.body.appendChild(panel);

  panel.querySelectorAll("a").forEach((enlace) => {
    if (enlace.dataset.pagina === pagina) {
      enlace.classList.add("activo");
    }
  });

  const botonMenu = document.createElement("button");
  botonMenu.className = "boton-menu";
  botonMenu.setAttribute("aria-label", "Menú");
  botonMenu.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;

  const encabezado = document.querySelector("header");
  encabezado.insertBefore(botonMenu, encabezado.firstChild);

  function abrirMenu() {
    document.getElementById("panelMenu").classList.add("abierto");
    document.getElementById("fondoMenu").classList.add("abierto");
  }
  function cerrarMenu() {
    document.getElementById("panelMenu").classList.remove("abierto");
    document.getElementById("fondoMenu").classList.remove("abierto");
  }

  botonMenu.addEventListener("click", abrirMenu);
  document.getElementById("fondoMenu").addEventListener("click", cerrarMenu);
}

document.addEventListener("DOMContentLoaded", inicializarMenuLateral);
