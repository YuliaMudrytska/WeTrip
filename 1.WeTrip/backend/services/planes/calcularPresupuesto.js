const calcularPresupuestoPorPersona = (presupuesto, tipoPresupuesto, personas) => {
  if (
    presupuesto === undefined ||
    presupuesto === null ||
    presupuesto === ""
  ) {
    return null;
  }

  const presupuestoNumero = Number(presupuesto);
  const personasNumero = Number(personas);

  if (
    Number.isNaN(presupuestoNumero) ||
    Number.isNaN(personasNumero) ||
    personasNumero < 1
  ) {
    return null;
  }

  if (tipoPresupuesto === "total") {
    return presupuestoNumero / personasNumero;
  }

  if (tipoPresupuesto === "individual") {
    return presupuestoNumero;
  }

  return null;
};

module.exports = { calcularPresupuestoPorPersona };