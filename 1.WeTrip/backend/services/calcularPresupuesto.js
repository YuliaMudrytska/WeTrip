const calcularPresupuestoPorPersona = (presupuesto, tipo, personas) => {
  if (!presupuesto) return null;

  if (tipo === "total") {
    return presupuesto / personas;
  }

  return presupuesto;
};

module.exports = { calcularPresupuestoPorPersona };