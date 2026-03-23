const Busqueda = require("../models/busqueda");
const User = require("../models/user");

const {
  calcularPresupuestoPorPersona
} = require("../services/planes/calcularPresupuesto");

// 📋 Crear formulario (guardar búsqueda)
const crearBusqueda = async (req, res) => {
  try {
    const {
      destino,
      personas,
      presupuesto,
      tipoPresupuesto,
      fechaInicio,
      fechaFin,
      planTipo,
      correos
    } = req.body;

    const userId = req.user?.id;

    if (!destino || !personas || !fechaInicio || !fechaFin || !planTipo) {
      return res.status(400).json({
        msg: "Faltan campos obligatorios"
      });
    }

    const presupuestoPorPersona = calcularPresupuestoPorPersona(
      presupuesto,
      tipoPresupuesto,
      personas
    );

    const nuevaBusqueda = new Busqueda({
      userId,
      destino,
      personas,
      presupuesto,
      tipoPresupuesto,
      presupuestoPorPersona,
      fechaInicio,
      fechaFin,
      planTipo,
      correos
    });

    await nuevaBusqueda.save();

    // Guardar en historial del usuario
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          historialBusquedas: {
            destino,
            personas,
            presupuesto,
            tipoPresupuesto,
            fechaInicio,
            fechaFin,
            planTipo
          }
        }
      });
    }

    res.status(201).json({
      busquedaId: nuevaBusqueda._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};


//🔄 Obtener búsqueda (para rellenar formulario)
const getBusqueda = async (req, res) => {
  try {
    const { id } = req.params;

    const busqueda = await Busqueda.findById(id);

    if (!busqueda) {
      return res.status(404).json({
        msg: "Búsqueda no encontrada"
      });
    }

    res.json(busqueda);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = {
  crearBusqueda,
  getBusqueda
};