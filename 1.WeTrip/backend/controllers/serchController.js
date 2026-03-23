const User = require("../models/user");

// 🔎 Buscar destino
const searchDestino = async (req, res) => {
  try {
    const { destino } = req.body;
    const userId = req.user?.id; // si usas auth

    if (!destino) {
      return res.status(400).json({
        msg: "Destino requerido"
      });
    }

    // Si no hay usuario → directamente formulario
    if (!userId) {
      return res.json({
        existeHistorial: false
      });
    }

    const user = await User.findById(userId);

    // Buscar en historial
    const busquedaAnterior = user.historialBusquedas.find(
      b => b.destino.toLowerCase() === destino.toLowerCase()
    );

    if (busquedaAnterior) {
      return res.json({
        existeHistorial: true,
        ultimaBusqueda: busquedaAnterior
      });
    }

    return res.json({
      existeHistorial: false
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = {
  searchDestino
};