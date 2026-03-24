const User = require("../models/user");
const Plan = require("../models/plan");

//contolador que añade o quita de favoritos las tarjetas de las opcines

const addFavorito = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    if (!planId) {
      return res.status(400).json({
        msg: "Se requiere planId"
      });
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        msg: "Plan no encontrado"
      });
    }

    const user = await User.findById(userId);

    const yaExiste = user.favoritos.some(
      (fav) => fav.toString() === planId
    );

    if (yaExiste) {
      return res.status(400).json({
        msg: "Este plan ya está en favoritos"
      });
    }

    user.favoritos.push(planId);
    await user.save();

    res.json({
      msg: "Plan añadido a favoritos",
      favoritos: user.favoritos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Eliminar de favoritos
const removeFavorito = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    user.favoritos = user.favoritos.filter(
      (fav) => fav.toString() !== planId
    );

    await user.save();

    res.json({
      msg: "Plan eliminado de favoritos",
      favoritos: user.favoritos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Obtener favoritos
const getFavoritos = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "favoritos",
      populate: {
        path: "destinoId"
      }
    });

    res.json({
      favoritos: user.favoritos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = {
  addFavorito,
  removeFavorito,
  getFavoritos
};