const { adaptarPlan } = require("./adaptarPlan");

const evaluarCambios = (planOriginal, nuevosDatos, planesDisponibles = []) => {
  let planValido = true;
  let planAdaptado = null;

  const {
    personas,
    presupuestoPorPersona,
    planTipoNuevo
  } = nuevosDatos;

  const personasNumero = Number(personas) || 1;
  const presupuestoNumero =
    presupuestoPorPersona !== undefined &&
    presupuestoPorPersona !== null &&
    presupuestoPorPersona !== ""
      ? Number(presupuestoPorPersona)
      : null;

  // Validar si el plan original sigue sirviendo
  if (planOriginal.maxPersonas < personasNumero) {
    planValido = false;
  }

  if (
    presupuestoNumero !== null &&
    planOriginal.precioBasePorPersona > presupuestoNumero
  ) {
    planValido = false;
  }

  // Si cambia el tipo, intentar adaptar
  if (planTipoNuevo && planTipoNuevo !== planOriginal.tipo) {
    planAdaptado = adaptarPlan(planOriginal, planTipoNuevo);

    if (planAdaptado) {
      if (planAdaptado.maxPersonas < personasNumero) {
        planAdaptado = null;
      }

      if (
        presupuestoNumero !== null &&
        planAdaptado &&
        planAdaptado.precioBasePorPersona > presupuestoNumero
      ) {
        planAdaptado = null;
      }
    }
  }

  // Buscar nuevas alternativas
  const destinoIdOriginal =
    planOriginal.destinoId?._id?.toString?.() ||
    planOriginal.destinoId?.toString?.();

  const nuevosPlanes = planesDisponibles.filter((plan) => {
    const destinoIdPlan =
      plan.destinoId?._id?.toString?.() ||
      plan.destinoId?.toString?.();

    const mismoDestino = destinoIdPlan === destinoIdOriginal;
    const capacidadValida = plan.maxPersonas >= personasNumero;
    const presupuestoValido =
      presupuestoNumero === null ||
      plan.precioBasePorPersona <= presupuestoNumero;
    const tipoValido = !planTipoNuevo || plan.tipo === planTipoNuevo;

    return mismoDestino && capacidadValida && presupuestoValido && tipoValido;
  });

  return {
    planOriginal: planValido ? planOriginal : null,
    planAdaptado,
    nuevosPlanes
  };
};

module.exports = { evaluarCambios };