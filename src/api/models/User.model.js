const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, 'Email not valid'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isStrongPassword],
      minlength: [8, 'Min 8 characters'],
    },
    gender: {
      type: String,
      enum: ['masculino', 'femenino'],
      required: true,
    },
    rol: {
      type: String,
      enum: ['alumn', 'teacher', 'admin'],
      required: true,
    },
    image: {
      type: String,
    },
    curso: {
      type: String,
      enum: ['1ESO', '2ESO', '3ESO', '4ESO'],
      required: true,
    },
    asignaturas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asignatura' }],
    notas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Nota' }],
    confirmationCode: {
      type: Number,
      required: true,
    },
    check: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next('Error hashing password', error);
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
