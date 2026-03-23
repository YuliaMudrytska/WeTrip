const Plan = require("../../models/Plan");

const { calcularPresupuestoPorPersona } = require("./calcularPresupuesto");
const { filtrarPlanes } = require("./filtrarPlanes");
const { evaluarCambios } = require("./evaluarCambios");

const generarPlanes = async (busqueda) => {
  const {
    destino,
    presupuesto,
    tipoPresupuesto,
    personas
  } = busqueda;

  const presupuestoPorPersona = calcularPresupuestoPorPersona(
    presupuesto,
    tipoPresupuesto,
    personas
  );

  // Obtener planes del destino
  const planes = await Plan.find().populate("destinoId");

  // Filtrar por destino
  const planesDestino = planes.filter(
    p => p.destinoId.ciudad === destino
  );

  const { planesFiltrados, mensaje } = filtrarPlanes(
    planesDestino,
    presupuestoPorPersona
  );

  return {
    planes: planesFiltrados,
    mensaje
  };
};

const reutilizarPlan = async (planOriginal, nuevosDatos) => {
  const planes = await Plan.find();

  const resultado = evaluarCambios(
    planOriginal,
    nuevosDatos,
    planes
  );

  return resultado;
};

module.exports = {
  generarPlanes,
  reutilizarPlan
};