const Plan = require("../models/plan");
const Busqueda = require("../models/busqueda");

const {
  generarPlanes,
  reutilizarPlan
} = require("../services/planes");

// 🔎 GENERAR PLANES (desde formulario)
const getPlanes = async (req, res) => {
  try {
    const { busquedaId } = req.body;

    if (!busquedaId) {
      return res.status(400).json({
        msg: "Se requiere busquedaId"
      });
    }

    const busqueda = await Busqueda.findById(busquedaId);

    if (!busqueda) {
      return res.status(404).json({
        msg: "Búsqueda no encontrada"
      });
    }

    const resultado = await generarPlanes(busqueda);

    res.json(resultado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// 🔁 REUTILIZAR PLAN (tu lógica avanzada)
const reutilizar = async (req, res) => {
  try {
    const { planId, nuevosDatos } = req.body;

    if (!planId) {
      return res.status(400).json({
        msg: "Se requiere planId"
      });
    }

    const planOriginal = await Plan.findById(planId);

    if (!planOriginal) {
      return res.status(404).json({
        msg: "Plan no encontrado"
      });
    }

    const resultado = await reutilizarPlan(
      planOriginal,
      nuevosDatos
    );

    res.json(resultado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = {
  getPlanes,
  reutilizar
};