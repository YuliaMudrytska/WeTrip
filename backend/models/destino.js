const mongoose = require("mongoose");

const destinoSchema = new mongoose.Schema({
  ciudad: {
      type: String,
      required: true,
      trim: true
    },

    pais: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    imagen: {
      type: String,
      default: ""
    },

    descripcion: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destino", destinoSchema);