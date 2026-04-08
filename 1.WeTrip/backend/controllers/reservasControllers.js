const User = require("../models/user");
const Plan = require("../models/plan");

// Crear reserva
const crearReserva = async (req, res) => {
  try {
    const {
      planId,
      destino,
      personas,
      fechaInicio,
      fechaFin,
      precioFinal,
      presupuesto,
      tipoPresupuesto,
      planTipo
    } = req.body;

    const userId = req.user.id;

    if ( !planId || !destino || !personas || !fechaInicio || !fechaFin || precioFinal === undefined || precioFinal === null) {
      return res.status(400).json({
        msg: "Faltan datos obligatorios para realizar la reserva"
      });
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        msg: "Plan no encontrado"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado"
      });
    }

    const personasNumero = Number(personas);
    const precioFinalNumero = Number(precioFinal);

    if (Number.isNaN(personasNumero) || personasNumero < 1) {
      return res.status(400).json({
        msg: "El número de personas no es válido"
      });
    }

    if (Number.isNaN(precioFinalNumero) || precioFinalNumero < 0) {
      return res.status(400).json({
        msg: "El precio final no es válido"
      });
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      return res.status(400).json({
        msg: "La fecha de vuelta no puede ser anterior a la fecha de ida"
      });
    }

    const planesSeleccionados = Array.isArray(planTipo) ? planTipo : [planTipo];

    user.reservas.push({
      planId,
      destino: destino.trim(),
      personas: personasNumero,
      presupuesto:
        presupuesto !== undefined && presupuesto !== null && presupuesto !== ""
          ? Number(presupuesto)
          : null,
      tipoPresupuesto:
        presupuesto !== undefined && presupuesto !== null && presupuesto !== ""
          ? tipoPresupuesto
          : null,
      fechaInicio,
      fechaFin,
      planTipo: planesSeleccionados.filter(Boolean),
      precioFinal: precioFinalNumero
    });

    await user.save();

    res.status(201).json({
      msg: "Reserva realizada correctamente",
      reservas: user.reservas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Obtener reservas activas
const getReservas = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "reservas.planId",
      populate: {
        path: "destinoId"
      }
    });

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado"
      });
    }

    res.json({
      reservas: user.reservas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Mover reservas vencidas a planes realizados
const moverAPlanesRealizados = async (req, res) => {
  try {
    const userId = req.user.id;
    const hoy = new Date();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado"
      });
    }

    const reservasActivas = [];
    const reservasPasadas = [];

    for (const reserva of user.reservas) {
      if (new Date(reserva.fechaFin) < hoy) {
        reservasPasadas.push(reserva);
      } else {
        reservasActivas.push(reserva);
      }
    }

    reservasPasadas.forEach((reserva) => {
      user.planesRealizados.push({
        planId: reserva.planId,
        destino: reserva.destino,
        personas: reserva.personas,
        presupuesto: reserva.presupuesto ?? null,
        tipoPresupuesto: reserva.tipoPresupuesto ?? null,
        fechaInicio: reserva.fechaInicio,
        fechaFin: reserva.fechaFin,
        planTipo: Array.isArray(reserva.planTipo) ? reserva.planTipo : [],
        precioFinal: reserva.precioFinal ?? null
      });
    });

    user.reservas = reservasActivas;

    await user.save();

    res.json({
      msg: "Reservas vencidas movidas a planes realizados",
      reservas: user.reservas,
      planesRealizados: user.planesRealizados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Obtener planes realizados
const getPlanesRealizados = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "planesRealizados.planId",
      populate: {
        path: "destinoId"
      }
    });

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado"
      });
    }

    res.json({
      planesRealizados: user.planesRealizados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = {
  crearReserva,
  getReservas,
  moverAPlanesRealizados,
  getPlanesRealizados
};