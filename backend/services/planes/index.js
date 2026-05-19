const Plan = require("../../models/plan");
require("../../models/destino");

const { calcularPresupuestoPorPersona } = require("./calcularPresupuesto");
const { filtrarPlanes } = require("./filtrarPlanes");
const { evaluarCambios } = require("./evaluarCambios");

const generarPlanes = async (busqueda) => {
  const {
    destino,
    presupuesto,
    tipoPresupuesto,
    personas,
    planTipo
  } = busqueda;

  const presupuestoPorPersona = calcularPresupuestoPorPersona( 
    presupuesto,
    tipoPresupuesto,
    personas
  );

  const planes = await Plan.find().populate("destinoId");

  const destinoNormalizado = destino.trim().toLowerCase();

  const planesDestino = planes.filter((plan) => {
    const ciudad = plan.destinoId?.ciudad?.trim().toLowerCase() || "";
    const pais = plan.destinoId?.pais?.trim().toLowerCase() || "";
    const ciudadPais = `${ciudad}, ${pais}`;

    return ciudad === destinoNormalizado || ciudadPais === destinoNormalizado;
  });

  const { planesFiltrados, mensaje } = filtrarPlanes(planesDestino, {
    presupuestoPorPersona,
    personas,
    planTipo: Array.isArray(planTipo) ? planTipo : []
  });

  return {
    planes: planesFiltrados,
    mensaje
  };
};

const reutilizarPlan = async (planOriginal, nuevosDatos) => {
  const destinoIdOriginal =
    planOriginal.destinoId?._id?.toString?.() ||
    planOriginal.destinoId?.toString?.();

  const planesDisponibles = await Plan.find({
    destinoId: destinoIdOriginal
  }).populate("destinoId");

  const resultado = evaluarCambios(
    planOriginal,
    nuevosDatos,
    planesDisponibles
  );

  return resultado;
};

module.exports = {
  generarPlanes,
  reutilizarPlan
};