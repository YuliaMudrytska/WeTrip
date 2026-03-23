const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  destinoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destino",
    required: true
  },

  tipo: {
    type: String,
    enum: [
      "completo",
      "transporte_alojamiento",
      "transporte_rutas",
      "alojamiento_rutas"
    ],
    required: true
  },

  descripcion: String,
  imagen: String,

  precioBasePorPersona: {
    type: Number,
    required: true
  },

  incluye: {
    transporte: { type: Boolean, default: false },
    alojamiento: { type: Boolean, default: false },
    rutas: { type: Boolean, default: false }
  },

  maxPersonas: {
    type: Number,
    default: 10
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);