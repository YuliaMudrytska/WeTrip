const evaluarCambios = (
  planOriginal,
  nuevosDatos,
  planesDisponibles
) => {
  let planValido = true;
  let planAdaptado = null;
  let nuevosPlanes = [];

  const {
    personas,
    presupuestoPorPersona,
    planTipoAnterior,
    planTipoNuevo
  } = nuevosDatos;

  // 👥 VALIDAR PERSONAS
  if (personas > planOriginal.maxPersonas) {
    planValido = false;
  }

  // 💰 PRESUPUESTO
  if (
    presupuestoPorPersona &&
    planOriginal.precioBasePorPersona > presupuestoPorPersona
  ) {
    planValido = false;
  }

  // 📦 CAMBIO DE PLAN
  if (planTipoNuevo && planTipoNuevo !== planTipoAnterior) {
    const cambiosCompatibles = [
      "transporte_alojamiento",
      "alojamiento_rutas"
    ];

    if (cambiosCompatibles.includes(planTipoNuevo)) {
      planAdaptado = require("./adaptarPlan").adaptarPlan(
        planOriginal,
        planTipoNuevo
      );
    } else {
      planValido = false;
    }
  }

  // 🔎 NUEVOS PLANES
  nuevosPlanes = planesDisponibles.filter(p => {
    return (
      p.precioBasePorPersona <= presupuestoPorPersona &&
      p.maxPersonas >= personas
    );
  });

  return {
    planOriginal: planValido ? planOriginal : null,
    planAdaptado,
    nuevosPlanes
  };
};

module.exports = { evaluarCambios };