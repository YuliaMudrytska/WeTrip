const Propuesta = require("../models/propuesta");
const Busqueda = require("../models/busqueda");
const Plan = require("../models/plan");
const User = require("../models/user");
const { enviarCorreoPropuesta } = require("../services/emailService");

// Crear propuesta con varios planes seleccionados
const crearPropuesta = async (req, res) => {
  try {
    const userId = req.user.id;
    const { busquedaId, planes } = req.body;

    if (!busquedaId || !planes || !Array.isArray(planes) || planes.length < 2) {
      return res.status(400).json({
        msg: "Debes seleccionar al menos 2 planes para crear una propuesta."
      });
    }

    if (planes.length > 10) {
      return res.status(400).json({
        msg: "No puedes seleccionar más de 10 planes."
      });
    }

    const busqueda = await Busqueda.findById(busquedaId);

    if (!busqueda) {
      return res.status(404).json({
        msg: "Búsqueda no encontrada."
      });
    }

    const planesEncontrados = await Plan.find({
      _id: { $in: planes }
    });

    if (planesEncontrados.length !== planes.length) {
      return res.status(400).json({
        msg: "Uno o varios planes seleccionados no existen."
      });
    }

    const correos = Array.isArray(busqueda.correos)
      ? busqueda.correos.map((correo) => correo.trim().toLowerCase()).filter(Boolean)
      : [];

    const nuevaPropuesta = await Propuesta.create({
      creador: userId,
      busquedaId,
      planes,
      correos,
      votos: [],
      planConfirmado: null,
      estado: "pendiente"
    });

    const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/propuesta/${nuevaPropuesta._id}`;

    if (correos.length > 0) {
      await enviarCorreoPropuesta(correos, link, busqueda.destino);
    }

    res.status(201).json({
      msg: "Propuesta creada correctamente.",
      propuestaId: nuevaPropuesta._id,
      link
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error creando propuesta."
    });
  }
};

// Obtener propuesta por ID
const getPropuestaById = async (req, res) => {
  try {
    const { id } = req.params;

    const propuesta = await Propuesta.findById(id)
      .populate({
        path: "planes",
        populate: {
          path: "destinoId",
          model: "Destino"
        }
      })
      .populate("planConfirmado")
      .populate("busquedaId");

    if (!propuesta) {
      return res.status(404).json({
        msg: "Propuesta no encontrada."
      });
    }

    res.json({
      propuesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error obteniendo propuesta."
    });
  }
};

// Votar por un plan
const votarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { correo, planId } = req.body;

    if (!correo || !planId) {
      return res.status(400).json({
        msg: "Correo y plan son obligatorios."
      });
    }

    const propuesta = await Propuesta.findById(id);

    if (!propuesta) {
      return res.status(404).json({
        msg: "Propuesta no encontrada."
      });
    }

    if (propuesta.estado !== "pendiente") {
      return res.status(400).json({
        msg: "Esta propuesta ya no admite votos."
      });
    }

    const correoNormalizado = correo.trim().toLowerCase();

    if (!propuesta.correos.includes(correoNormalizado)) {
      return res.status(403).json({
        msg: "Este correo no pertenece a la propuesta."
      });
    }

    const planPertenece = propuesta.planes.some(
      (plan) => plan.toString() === planId
    );

    if (!planPertenece) {
      return res.status(400).json({
        msg: "El plan seleccionado no pertenece a esta propuesta."
      });
    }

    const votoExistente = propuesta.votos.find(
      (voto) => voto.correo === correoNormalizado
    );

    if (votoExistente) {
      votoExistente.planId = planId;
      votoExistente.fechaVoto = new Date();
    } else {
      propuesta.votos.push({
        correo: correoNormalizado,
        planId
      });
    }

    await propuesta.save();

    res.json({
      msg: "Voto guardado correctamente.",
      votos: propuesta.votos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error guardando voto."
    });
  }
};

// Confirmar un plan y crear reserva final
const confirmarPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        msg: "Debes indicar el plan que quieres confirmar."
      });
    }

    const propuesta = await Propuesta.findById(id).populate("busquedaId");

    if (!propuesta) {
      return res.status(404).json({
        msg: "Propuesta no encontrada."
      });
    }

    if (propuesta.creador.toString() !== userId) {
      return res.status(403).json({
        msg: "Solo el creador de la propuesta puede confirmar el plan."
      });
    }

    if (propuesta.estado !== "pendiente") {
      return res.status(400).json({
        msg: "Esta propuesta ya fue confirmada o cancelada."
      });
    }

    const planPertenece = propuesta.planes.some(
      (plan) => plan.toString() === planId
    );

    if (!planPertenece) {
      return res.status(400).json({
        msg: "El plan seleccionado no pertenece a esta propuesta."
      });
    }

    const plan = await Plan.findById(planId).populate("destinoId");

    if (!plan) {
      return res.status(404).json({
        msg: "Plan no encontrado."
      });
    }

    const busqueda = propuesta.busquedaId;

    if (!busqueda) {
      return res.status(404).json({
        msg: "Búsqueda asociada no encontrada."
      });
    }

    const destinoFormateado = [plan.destinoId?.ciudad, plan.destinoId?.pais]
      .filter(Boolean)
      .join(", ");

    const precioFinal =
      Number(plan.precioBasePorPersona) * Number(busqueda.personas);

    const reservaFinal = {
      planId: plan._id,
      destino: destinoFormateado,
      personas: busqueda.personas,
      presupuesto: busqueda.presupuesto,
      tipoPresupuesto: busqueda.tipoPresupuesto,
      fechaInicio: busqueda.fechaInicio,
      fechaFin: busqueda.fechaFin,
      planTipo: busqueda.planTipo,
      precioFinal
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      });
    }

    user.reservas.push(reservaFinal);

    propuesta.planConfirmado = plan._id;
    propuesta.estado = "confirmada";

    await user.save();
    await propuesta.save();

    res.json({
      msg: "Plan confirmado y reserva creada correctamente.",
      reserva: reservaFinal,
      propuesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error confirmando propuesta."
    });
  }
};

// Obtener mis propuestas creadas
const getMisPropuestas = async (req, res) => {
  try {
    const userId = req.user.id;

    const propuestas = await Propuesta.find({
      creador: userId
    })
    .populate({
      path: "planes",
      populate: {
        path: "destinoId",
        model: "Destino"
      }
    })
    .populate("planConfirmado")
    .sort({ createdAt: -1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error cargando propuestas"
    });
  }
};

module.exports = {
  crearPropuesta,
  getPropuestaById,
  votarPlan,
  confirmarPlan,
  getMisPropuestas
};