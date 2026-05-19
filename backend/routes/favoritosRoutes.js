const express = require("express");
const router = express.Router();

const {
  addFavorito,
  removeFavorito,
  getFavoritos
} = require("../controllers/favoritosController");

const { protect } = require("../middlewares/authMiddleware");

// Obtener favoritos
router.get("/", protect, getFavoritos);

// Añadir a favoritos
router.post("/", protect, addFavorito);

// Eliminar de favoritos
router.delete("/:planId", protect, removeFavorito);

module.exports = router;