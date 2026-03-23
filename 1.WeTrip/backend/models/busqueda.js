const mongoose = require("mongoose");

const busquedaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    destino: {
      type: String,
      required: true
    },

    personas: {
      type: Number,
      required: true
    },

    presupuesto: Number,

    tipoPresupuesto: {
      type: String,
      enum: ["total", "individual"]
    },

    presupuestoPorPersona: Number,

    fechaInicio: Date,
    fechaFin: Date,

    planTipo: {
      type: String,
      enum: [
        "completo",
        "transporte_alojamiento",
        "transporte_rutas",
        "alojamiento_rutas"
      ]
    },

    correos: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Busqueda", busquedaSchema);