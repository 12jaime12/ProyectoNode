const mongoose = require('mongoose');

const NotasSchema = new mongoose.Schema(
  {
    asignatura: { type: mongoose.Schema.Types.ObjectId, ref: 'Asignatura' },
    alumn: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nota: { type: Number, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Notas = mongoose.model('Nota', NotasSchema);
module.exports = Notas;
