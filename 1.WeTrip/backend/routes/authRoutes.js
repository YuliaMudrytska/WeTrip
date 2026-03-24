const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

// Registro
router.post("/register", register);

// Login
router.post("/login", login);

// Usuario autenticado
router.get("/me", protect, getMe);

module.exports = router;