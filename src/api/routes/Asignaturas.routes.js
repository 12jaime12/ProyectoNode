const express = require('express');
const {
  create,
  deleteAsignatura,
  addAlumn,
  addTeacher,
} = require('../controllers/Asignaturas.controllers');
const { isAuthAdmin } = require('../../middleware/auth.middleware');
const AsignaturasRoutes = express.Router();

AsignaturasRoutes.post('/create', [isAuthAdmin], create);
AsignaturasRoutes.delete('/delete/:id', [isAuthAdmin], deleteAsignatura);
AsignaturasRoutes.post('/addAlumn/:id', [isAuthAdmin], addAlumn);

module.exports = AsignaturasRoutes;
