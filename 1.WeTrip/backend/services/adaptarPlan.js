const adaptarPlan = (planOriginal, nuevoTipo) => {
  const plan = JSON.parse(JSON.stringify(planOriginal));

  const tipos = {
    completo: {
      transporte: true,
      alojamiento: true,
      rutas: true
    },
    transporte_alojamiento: {
      transporte: true,
      alojamiento: true,
      rutas: false
    },
    transporte_rutas: {
      transporte: true,
      alojamiento: false,
      rutas: true
    },
    alojamiento_rutas: {
      transporte: false,
      alojamiento: true,
      rutas: true
    }
  };

  plan.incluye = tipos[nuevoTipo];
  plan.tipo = nuevoTipo;

  plan.esAdaptado = true;

  return plan;
};

module.exports = { adaptarPlan };