const mongoose = require("mongoose");

const busquedaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      default: null
    },

    nombre:{
      type: String,
      required: true,
      trim: true
    },

    destino: {
      type: String,
      required: true, 
      trim: true
    },

    personas: {
      type: Number,
      required: true,
      min: 1
    },

    presupuesto: {
      type: Number,
      default: null,
      min: 0
    },

    tipoPresupuesto: {
      type: String,
      enum: ["total", "individual", null],
      default: null 
    },

    presupuestoPorPersona: {
      type: Number,
      default: null,
      min: 0
    },
  

    fechaInicio: {
      type: Date, 
      required: true
    },

    fechaFin: {
      type: Date,
      required: true
    },

    planTipo: [
      {
        type: String,
        enum: [
          "completo",
          "transporte_alojamiento",
          "transporte_rutas",
          "alojamiento_rutas"
        ]
      }
    ],

    correos: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Busqueda", busquedaSchema);