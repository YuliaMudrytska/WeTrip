const filtrarPlanes = (planes, presupuestoPorPersona) => {
  // SI NO hay presupuesto → ≤ 500€
  if (!presupuestoPorPersona) {
    return {
      planesFiltrados: planes.filter(p => p.precioBasePorPersona <= 500),
      mensaje: "El coste mínimo parte de 500€ por persona"
    };
  }

  // SI hay presupuesto
  return {
    planesFiltrados: planes.filter(
      p => p.precioBasePorPersona <= presupuestoPorPersona
    ),
    mensaje: null
  };
};

module.exports = { filtrarPlanes };