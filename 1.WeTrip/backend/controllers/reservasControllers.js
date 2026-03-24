const User = require("../models/user");
const Plan = require("../models/plan");

//controlador que gestiona las reservas, una vez elegido el plan crea la reserva de ese plan

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

    if (!planId || !personas || !fechaInicio || !fechaFin) {
      return res.status(400).json({
        msg: "Por favor rellene los campos que le faltán"
      });
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        msg: "Plan no encontrado"
      });
    }

    const user = await User.findById(userId);

    user.reservas.push({
      planId,
      destino,
      personas,
      fechaInicio,
      fechaFin,
      precioFinal
    });

    await user.save();

    res.status(201).json({
      msg: "resrva realizada",
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
        fechaInicio: reserva.fechaInicio,
        fechaFin: reserva.fechaFin,
        planTipo: "reservado"
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