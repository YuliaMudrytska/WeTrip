const express = require("express");
const router = express.Router();

const {
  getPlanes,
  reutilizar
} = require("../controllers/planesController");

// Obtener planes desde una búsqueda
router.post("/", getPlanes);

// Reutilizar plan anterior
router.post("/reutilizar", reutilizar);

module.exports = router;