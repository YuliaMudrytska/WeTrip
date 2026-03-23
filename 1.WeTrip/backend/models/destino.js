const mongoose = require("mongoose");

const destinoSchema = new mongoose.Schema({
  ciudad: {
    type: String,
    required: true
  },
  pais: {
    type: String,
    required: true
  },
  imagen: String,
  descripcion: String
});

module.exports = mongoose.model("Destino", destinoSchema);