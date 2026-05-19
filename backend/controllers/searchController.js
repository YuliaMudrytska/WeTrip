const User = require("../models/user");

// Buscar destino desde la lupa o input principal
const searchDestino = async (req, res) => {
  try {
    const { destino } = req.body;
    const userId = req.user?.id || null;

    if (!destino) {
      return res.status(400).json({
        msg: "Destino requerido"
      });
    }

    const destinoNormalizado = destino.trim().toLowerCase();

    // Si no hay usuario logueado -> irá al formulario
    if (!userId) {
      return res.json({
        estaLogueado: false,
        existeHistorial: false
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado"
      });
    }

    const busquedaAnterior = user.historialBusquedas.find(
      (b) => b.destino.trim().toLowerCase() === destinoNormalizado
    );

    if (busquedaAnterior) {
      return res.json({
        estaLogueado: true,
        existeHistorial: true,
        ultimaBusqueda: busquedaAnterior
      });
    }

    return res.json({
      estaLogueado: true,
      existeHistorial: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const getHistorialBusquedas = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("historialBusquedas");

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado"
      });
    }

    const historial = user.historialBusquedas
      .map((busqueda) => ({
        destino: busqueda.destino,
        nombre: busqueda.nombre,
        busquedaId: busqueda.busquedaId || busqueda._id
      }))
      .reverse();

    res.json({
      historial
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error obteniendo historial"
    });
  }
};

module.exports = {
  searchDestino,
  getHistorialBusquedas
};