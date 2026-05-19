const filtrarPlanes = (planes, opciones = {}) => {
  const {
    presupuestoPorPersona = null,
    personas = 1,
    planTipo = []
  } = opciones;

  let resultado = [...planes];
  let mensaje = null;

  // Filtrar por número de personas
  resultado = resultado.filter((plan) => plan.maxPersonas >= personas);

  // Filtrar por tipo de plan
  if (Array.isArray(planTipo) && planTipo.length > 0) {
    resultado = resultado.filter((plan) => planTipo.includes(plan.tipo));
  }

  // Si no hay presupuesto, mostramos planes hasta 500€/persona
  if (presupuestoPorPersona === null) {
    resultado = resultado.filter((plan) => plan.precioBasePorPersona <= 500);

    resultado.sort(
      (a, b) => a.precioBasePorPersona - b.precioBasePorPersona
    );

    mensaje = "El coste mínimo parte de 500€ por persona";

    return {
      planesFiltrados: resultado,
      mensaje
    };
  }

  const presupuesto = Number(presupuestoPorPersona);

  const limiteSuperior = presupuesto + 100;
  const limiteInferior = Math.max(0, presupuesto - 100);

  const planesSuperiores = resultado
    .filter(
      (plan) =>
        plan.precioBasePorPersona >= presupuesto &&
        plan.precioBasePorPersona <= limiteSuperior
    )
    .sort((a, b) => a.precioBasePorPersona - b.precioBasePorPersona);

  const planesInferiores = resultado
    .filter(
      (plan) =>
        plan.precioBasePorPersona < presupuesto &&
        plan.precioBasePorPersona >= limiteInferior
    )
    .sort((a, b) => b.precioBasePorPersona - a.precioBasePorPersona);

  resultado = [...planesSuperiores, ...planesInferiores];

  return {
    planesFiltrados: resultado,
    mensaje
  };
};

module.exports = { filtrarPlanes };