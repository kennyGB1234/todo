const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  contraseña: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Usuario", usuarioSchema);