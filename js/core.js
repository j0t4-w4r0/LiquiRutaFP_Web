// core.js — el "motor" de la app, igual que LiquidacionCalculator.kt en Android.
// Sin nada de interfaz aquí, solo cálculos puros, para poder probarlo aislado.

const DENOMINACIONES = [
  { nombre: "CIEN_MIL", valor: 100000 },
  { nombre: "CINCUENTA_MIL", valor: 50000 },
  { nombre: "VEINTE_MIL", valor: 20000 },
  { nombre: "DIEZ_MIL", valor: 10000 },
  { nombre: "CINCO_MIL", valor: 5000 },
  { nombre: "DOS_MIL", valor: 2000 },
];

const LiquidacionCalculator = {
  totalFacturasEfectivo(ruta) {
    return ruta.facturas
      .filter((f) => f.tipo === "PAGO_TOTAL")
      .reduce((suma, f) => suma + f.monto, 0);
  },

  totalAbonosYCobros(ruta) {
    return ruta.facturas
      .filter((f) => f.tipo === "ABONO")
      .reduce((suma, f) => suma + f.monto, 0);
  },

  totalGastos(ruta) {
    return ruta.gastos.reduce((suma, g) => suma + g.monto, 0);
  },

  totalALiquidar(ruta) {
    return (
      this.totalFacturasEfectivo(ruta) +
      this.totalAbonosYCobros(ruta) -
      this.totalGastos(ruta)
    );
  },

  cantidadPorDenominacion(ruta) {
    const resultado = {};
    for (const denom of DENOMINACIONES) {
      resultado[denom.nombre] = ruta.conteoBilletes
        .filter((c) => c.denominacion === denom.nombre)
        .reduce((suma, c) => suma + c.cantidad, 0);
    }
    return resultado;
  },

  totalPorDenominacion(ruta) {
    const cantidades = this.cantidadPorDenominacion(ruta);
    const resultado = {};
    for (const denom of DENOMINACIONES) {
      resultado[denom.nombre] = denom.valor * cantidades[denom.nombre];
    }
    return resultado;
  },

  totalEnBilletes(ruta) {
    const totales = this.totalPorDenominacion(ruta);
    return Object.values(totales).reduce((suma, v) => suma + v, 0);
  },

  monedas(ruta) {
    return this.totalALiquidar(ruta) - this.totalEnBilletes(ruta);
  },

  calcular(ruta) {
    return {
      totalFacturasEfectivo: this.totalFacturasEfectivo(ruta),
      totalAbonosYCobros: this.totalAbonosYCobros(ruta),
      totalGastos: this.totalGastos(ruta),
      totalALiquidar: this.totalALiquidar(ruta),
      totalPorDenominacion: this.totalPorDenominacion(ruta),
      totalEnBilletes: this.totalEnBilletes(ruta),
      monedas: this.monedas(ruta),
    };
  },
};
