const mongoose = require('mongoose');

const AsignaturaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    alumn: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    year: { type: Number, required: true, trim: true },
    nota: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Nota' }],
    curso: {
      type: String,
      enum: ['1ESO', '2ESO', '3ESO', '4ESO'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Asignatura = mongoose.model('Asignatura', AsignaturaSchema);
module.exports = Asignatura;
