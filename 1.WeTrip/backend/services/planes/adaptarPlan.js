const TIPOS_PLAN = {
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

const adaptarPlan = (planOriginal, nuevoTipo) => {
  if (!TIPOS_PLAN[nuevoTipo]) {
    return null;
  }

  const planAdaptado = {
    ...(planOriginal.toObject ? planOriginal.toObject() : planOriginal),
    tipo: nuevoTipo,
    incluye: TIPOS_PLAN[nuevoTipo],
    esAdaptado: true
  };

  return planAdaptado;
};

module.exports = { adaptarPlan, TIPOS_PLAN };