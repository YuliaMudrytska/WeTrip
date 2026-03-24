const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//autentifica y registra al usuario, verefica usuarios ya exixtentes y añade nuevos

// Generar token
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// Registro
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        msg: `Por favor rellene todos los campos`
      });
    }

    const existeUsuario = await User.findOne({ email });

    if (existeUsuario) {
      return res.status(400).json({
        msg: `Ya existe una cuenta con este correo`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      nombre,
      email,
      password: passwordHasheada,
      favoritos: [],
      reservas: [],
      planesRealizados: [],
      historialBusquedas: []
    });

    await nuevoUsuario.save();

    res.status(201).json({
      user: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      },
      token: generarToken(nuevoUsuario._id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: `Por favor rellene todos los campos`
      });
    }

    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        msg: `El usuario no se ha enconrado`
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(400).json({
        msg: `La contraseña no correspone.`
      });
    }

    res.json({
      user: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      },
      token: generarToken(usuario._id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Usuario autenticado
const getMe = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).select("-password");

    if (!usuario) {
      return res.status(404).json({
        msg: "Usuario no encontrado"
      });
    }

    res.json(usuario);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = {
  register,
  login,
  getMe
};