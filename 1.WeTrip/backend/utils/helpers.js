const normalizarTexto = (texto = "") => {
  return texto.trim().toLowerCase();
};

const esFechaPasada = (fecha) => {
  return new Date(fecha) < new Date();
};

const calcularDiasEntreFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  const diferenciaMs = fin - inicio;
  return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
};

const formatearDestino = (ciudad, pais) => {
  return `${ciudad}, ${pais}`;
};

const limpiarArrayCorreos = (correos = []) => {
  return correos
    .map((correo) => correo.trim())
    .filter((correo) => correo !== "");
};

module.exports = {
  normalizarTexto,
  esFechaPasada,
  calcularDiasEntreFechas,
  formatearDestino,
  limpiarArrayCorreos
};