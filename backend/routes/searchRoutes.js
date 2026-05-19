const express = require("express");
const router = express.Router();

const {
  searchDestino,
  getHistorialBusquedas
} = require("../controllers/searchController");

const { optionalProtect } = require("../middlewares/optionalAuthMiddleware");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", optionalProtect, searchDestino);
router.get("/historial", protect, getHistorialBusquedas);

module.exports = router;