const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
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

    precioFinal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const planRealizadoSchema = new mongoose.Schema(
  {
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
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

    precioFinal: {
      type: Number,
      default: null,
      min: 0
    }
  },
  { _id: false }
);


const historialBusquedaSchema = new mongoose.Schema(
  {
  nombre: {
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
  { _id: false, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
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

    reservas: {
      type: [reservaSchema],
      default: []
    },

    planesRealizados: {
      type: [planRealizadoSchema],
      default: []
    },

    historialBusquedas: {
      type: [historialBusquedaSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);