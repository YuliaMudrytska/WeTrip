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

  // Filtrar por presupuesto
  if (presupuestoPorPersona === null) {
    resultado = resultado.filter((plan) => plan.precioBasePorPersona <= 500);
    mensaje = "El coste mínimo parte de 500€ por persona";
  } else {
    resultado = resultado.filter(
      (plan) => plan.precioBasePorPersona <= presupuestoPorPersona
    );
  }

  return {
    planesFiltrados: resultado,
    mensaje
  };
};

module.exports = { filtrarPlanes };