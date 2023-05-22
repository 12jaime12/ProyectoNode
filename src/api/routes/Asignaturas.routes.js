const express = require('express');
const {
  create,
  deleteAsignatura,
  AddAlumn,
  addTeacher,
} = require('../controllers/Asignaturas.controllers');
const AsignaturasRoutes = express.Router();

module.exports = AsignaturasRoutes;
