const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verificarEmail,
  getMe,
  actualizarPerfil
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

// Registro
router.post("/register", register);

// Login
router.post("/login", login);

//correo verificado
router.get("/verify-email", verificarEmail);

// Usuario autenticado
router.get("/me", protect, getMe);

//actualizar datos
router.put("/me", protect, actualizarPerfil);

module.exports = router;