const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
});
