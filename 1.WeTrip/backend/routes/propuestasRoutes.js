const express = require("express");
const router = express.Router();

const {
  crearPropuesta,
  getPropuestaById,
  votarPlan,
  confirmarPlan,
  getMisPropuestas
} = require("../controllers/propuestasController");

const { protect } = require("../middlewares/authMiddleware");


// Crear propuesta desde los planes seleccionados
router.post("/", protect, crearPropuesta);

// Ver mis propuestas creadas
router.get("/mis-propuestas", protect, getMisPropuestas);

// Ver propuesta desde el enlace compartido
router.get("/:id", getPropuestaById);

// Votar por un plan desde el enlace
router.post("/:id/votar", votarPlan);

// Confirmar un único plan y crear reserva final
router.post("/:id/confirmar", protect, confirmarPlan);

module.exports = router;