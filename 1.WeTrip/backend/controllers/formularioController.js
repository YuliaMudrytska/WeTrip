const Busqueda = require("../models/busqueda");
const User = require("../models/user");

const {
  calcularPresupuestoPorPersona
} = require("../services/planes/calcularPresupuesto");

// Crear formulario / guardar búsqueda
const crearBusqueda = async (req, res) => {
  try {
    const {
      nombre,
      destino,
      personas,
      presupuesto,
      tipoPresupuesto,
      fechaInicio,
      fechaFin,
      planTipo,
      correos
    } = req.body;

    const userId = req.user?.id || null;

    if ( !nombre || !destino || !personas || !fechaInicio || !fechaFin || !planTipo) {
      return res.status(400).json({
        msg: "Faltan campos obligatorios"
      });
    }

    const personasNumero = Number(personas);

    if (Number.isNaN(personasNumero) || personasNumero < 1) {
      return res.status(400).json({
        msg: "El número de personas no es válido"
      });
    }

    const planesSeleccionados = Array.isArray(planTipo) ? planTipo : [planTipo];
    const listaCorreos = Array.isArray(correos) ? correos.filter(Boolean) : [];

    if (planesSeleccionados.length === 0) {
      return res.status(400).json({
        msg: "Debes seleccionar al menos un tipo de plan"
      });
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      return res.status(400).json({
        msg: "La fecha de vuelta no puede ser anterior a la de ida"
      });
    }

    if (personasNumero >= 2 && listaCorreos.length < 2) {
      return res.status(400).json({
        msg: "Debes añadir al menos dos correos si viajan dos o más personas"
      });
    }

    const presupuestoNormalizado =
      presupuesto !== undefined && presupuesto !== null && presupuesto !== ""
        ? Number(presupuesto)
        : null;

    const presupuestoPorPersona = calcularPresupuestoPorPersona(
      presupuestoNormalizado,
      tipoPresupuesto,
      personasNumero
    );

    const nuevaBusqueda = new Busqueda({
      userId,
      nombre: nombre.trim(),
      destino: destino.trim(),
      personas: personasNumero,
      presupuesto: presupuestoNormalizado,
      tipoPresupuesto: presupuestoNormalizado !== null ? tipoPresupuesto : null,
      presupuestoPorPersona,
      fechaInicio,
      fechaFin,
      planTipo: planesSeleccionados,
      correos: listaCorreos
    });

    await nuevaBusqueda.save();

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          historialBusquedas: {
            nombre: nombre.trim(),
            destino: destino.trim(),
            personas: personasNumero,
            presupuesto: presupuestoNormalizado,
            tipoPresupuesto: presupuestoNormalizado !== null ? tipoPresupuesto : null,
            fechaInicio,
            fechaFin,
            planTipo: planesSeleccionados,
            correos: listaCorreos
          }
        }
      });
    }

    res.status(201).json({
      msg: "Búsqueda guardada correctamente",
      busquedaId: nuevaBusqueda._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Obtener búsqueda
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