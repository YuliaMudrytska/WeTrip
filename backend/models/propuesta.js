const mongoose = require("mongoose");

const votoSchema = new mongoose.Schema(
  {
    correo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },

    fechaVoto: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const propuestaSchema = new mongoose.Schema(
  {
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    busquedaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Busqueda",
      required: true
    },

    planes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
      }
    ],

    correos: {
      type: [String],
      default: []
    },

    votos: {
      type: [votoSchema],
      default: []
    },

    planConfirmado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null
    },

    estado: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada"],
      default: "pendiente"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Propuesta", propuestaSchema);