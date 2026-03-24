const express = require("express");
const router = express.Router();

const {
  crearBusqueda,
  getBusqueda
} = require("../controllers/formularioController");


router.post("/", crearBusqueda);
router.get("/:id", getBusqueda);

module.exports = router;