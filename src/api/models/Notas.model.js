const mongoose = require('mongoose');

const NotasSchema = new mongoose.Schema(
  {
    asignatura: { type: String },
    alumn: { type: String },
    nota: { type: Number, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Notas = mongoose.model('Nota', NotasSchema);
module.exports = Notas;
