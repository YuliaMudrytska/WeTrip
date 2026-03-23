const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
  },
  destino: String,
  personas: Number,
  fechaInicio: Date,
  fechaFin: Date,
  precioFinal: Number
});

const planRealizadoSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan"
  },
  destino: String,
  personas: Number,
  presupuesto: Number,
  tipoPresupuesto: {
    type: String,
    enum: ["total", "individual"]
  },
  fechaInicio: Date,
  fechaFin: Date,
  planTipo: String
});

const historialBusquedaSchema = new mongoose.Schema({
  destino: String,
  personas: Number,
  presupuesto: Number,
  tipoPresupuesto: {
    type: String,
    enum: ["total", "individual"]
  },
  fechaInicio: Date,
  fechaFin: Date,
  planTipo: String
});

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },

    favoritos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan"
      }
    ],

    reservas: [reservaSchema],

    planesRealizados: [planRealizadoSchema],

    historialBusquedas: [historialBusquedaSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);