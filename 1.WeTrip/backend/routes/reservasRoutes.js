const express = require("express");
const router = express.Router();

const {
  crearReserva,
  getReservas,
  moverAPlanesRealizados,
  getPlanesRealizados
} = require("../controllers/reservasController");

const { protect } = require("../middlewares/authMiddleware");

// Crear reserva
router.post("/", protect, crearReserva);

// Obtener reservas activas
router.get("/", protect, getReservas);

// Mover reservas vencidas a planes realizados
router.post("/mover-a-realizados", protect, moverAPlanesRealizados);

// Obtener planes realizados
router.get("/realizados", protect, getPlanesRealizados);

module.exports = router;