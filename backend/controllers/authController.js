const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { enviarCorreoVerificacion } = require("../services/emailService");

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

    const emailNormalizado = email.trim().toLowerCase();

    const existeUsuario = await User.findOne({ email: emailNormalizado });

    if (existeUsuario) {
      return res.status(400).json({
        msg: `Ya existe una cuenta con este correo`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const tokenVerificacion = crypto.randomBytes(32).toString("hex");

    const tokenExpira = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const nuevoUsuario = new User({
      nombre: nombre.trim(),
      email: emailNormalizado,
      password: passwordHasheada,
      emailVerificado: false,
      tokenVerificacionEmail: tokenVerificacion,
      tokenVerificacionExpira: tokenExpira,
      favoritos: [],
      reservas: [],
      planesRealizados: [],
      historialBusquedas: []
    });

    await nuevoUsuario.save();

      const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verificar-email/${tokenVerificacion}`;

    await enviarCorreoVerificacion(nuevoUsuario.email, link);

    res.status(201).json({
      user: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        imagenPerfil: nuevoUsuario.imagenPerfil
      },
      token: generarToken(nuevoUsuario._id),
      msg: "Revisa tu correo para verificar la cuenta."
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

    const emailNormalizado = email.trim().toLowerCase();

    const usuario = await User.findOne({ email: emailNormalizado });

    if (!usuario) {
      return res.status(400).json({
        msg: `El usuario no se ha enconrado`
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(400).json({
        msg: `La contraseña no correspone`
      });
    }

    res.json({
      user: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        imagenPerfil: usuario.imagenPerfil
      },
      token: generarToken(usuario._id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

/*Verificación del correo electrónico
const verificarEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const usuario = await User.findOne({
      tokenVerificacionEmail: token,
      tokenVerificacionExpira: { $gt: new Date() }
    });

    if (!usuario) {
      return res.status(400).json({
        msg: "El enlace de verificación no es válido o ha expirado."
      });
    }

    usuario.emailVerificado = true;
    usuario.tokenVerificacionEmail = null;
    usuario.tokenVerificacionExpira = null;

    await usuario.save();

    res.json({
      msg: "Correo verificado correctamente."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error verificando correo."
    });
  }
};*/

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

const actualizarPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, password, imagenPerfil } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado"
      });
    }

    if (nombre && nombre.trim() !== "") {
      user.nombre = nombre.trim();
    }

    if (imagenPerfil !== undefined) {
      user.imagenPerfil = imagenPerfil;
    }

    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return res.status(400).json({
          msg: "La contraseña debe tener al menos 6 caracteres."
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      msg: "Perfil actualizado correctamente",
     user: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        imagenPerfil: user.imagenPerfil
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error actualizando perfil"
    });
  }
};

module.exports = {
  register,
  login,
  verificarEmail,
  getMe,
  actualizarPerfil
};