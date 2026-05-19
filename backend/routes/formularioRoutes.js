const express = require("express");
const router = express.Router();

const {
  crearBusqueda,
  getBusqueda
} = require("../controllers/formularioController");

const {
  optionalProtect
} = require("../middlewares/optionalAuthMiddleware");

router.post("/", optionalProtect, crearBusqueda);

router.get("/:id", getBusqueda);

module.exports = router;