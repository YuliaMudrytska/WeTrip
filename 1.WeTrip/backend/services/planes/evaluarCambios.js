const { adaptarPlan } = require("./adaptarPlan");

const evaluarCambios = (planOriginal, nuevosDatos, planesDisponibles = []) => {
  let planOriginalValido = true;
  let planesAdaptados = [];

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

  const tiposNuevos = Array.isArray(planTipoNuevo)
    ? planTipoNuevo.filter(Boolean)
    : planTipoNuevo
      ? [planTipoNuevo]
      : [];

  // 1. Validar si el plan original sigue sirviendo
  if (planOriginal.maxPersonas < personasNumero) {
    planOriginalValido = false;
  }

  if (
    presupuestoNumero !== null &&
    planOriginal.precioBasePorPersona > presupuestoNumero
  ) {
    planOriginalValido = false;
  }

  // Si se han indicado tipos nuevos y el original no está entre ellos, deja de valer como original puro
  if (tiposNuevos.length > 0 && !tiposNuevos.includes(planOriginal.tipo)) {
    planOriginalValido = false;
  }

  // 2. Intentar adaptar el plan original a varios tipos nuevos
  if (tiposNuevos.length > 0) {
    planesAdaptados = tiposNuevos
      .filter((tipo) => tipo !== planOriginal.tipo)
      .map((tipo) => adaptarPlan(planOriginal, tipo))
      .filter((plan) => plan !== null)
      .filter((plan) => {
        const capacidadValida = plan.maxPersonas >= personasNumero;
        const presupuestoValido =
          presupuestoNumero === null ||
          plan.precioBasePorPersona <= presupuestoNumero;

        return capacidadValida && presupuestoValido;
      });
  }

  // Evitar duplicados en adaptados por si acaso
  const tiposAdaptadosUnicos = new Set();
  planesAdaptados = planesAdaptados.filter((plan) => {
    if (tiposAdaptadosUnicos.has(plan.tipo)) {
      return false;
    }
    tiposAdaptadosUnicos.add(plan.tipo);
    return true;
  });

  // 3. Buscar nuevas alternativas reales en BD
  const destinoIdOriginal =
    planOriginal.destinoId?._id?.toString?.() ||
    planOriginal.destinoId?.toString?.();

  let nuevosPlanes = planesDisponibles.filter((plan) => {
    const destinoIdPlan =
      plan.destinoId?._id?.toString?.() ||
      plan.destinoId?.toString?.();

    const mismoDestino = destinoIdPlan === destinoIdOriginal;
    const capacidadValida = plan.maxPersonas >= personasNumero;
    const presupuestoValido =
      presupuestoNumero === null ||
      plan.precioBasePorPersona <= presupuestoNumero;

    const tipoValido =
      tiposNuevos.length === 0 || tiposNuevos.includes(plan.tipo);

    return mismoDestino && capacidadValida && presupuestoValido && tipoValido;
  });

  // Evitar duplicar el plan original dentro de nuevosPlanes
  nuevosPlanes = nuevosPlanes.filter(
    (plan) => plan._id.toString() !== planOriginal._id.toString()
  );

  return {
    planOriginal: planOriginalValido ? planOriginal : null,
    planesAdaptados,
    nuevosPlanes
  };
};

module.exports = { evaluarCambios };