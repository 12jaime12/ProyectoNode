const express = require('express');
const {
  register,
  verificarCodigo,
  login,
  forgotPassword,
  ChangePassword,
  update,
  deleteUser,
  logout,
  getUsuariosCurso,
} = require('../controllers/User.controllers');
const UserRoutes = express.Router();

module.exports = UserRoutes;
