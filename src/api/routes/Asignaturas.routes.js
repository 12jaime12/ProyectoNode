const express = require('express');
const {
  create,
  deleteAsignatura,
  addAlumn,
  addTeacher,
  getNotasCurso,
} = require('../controllers/Asignaturas.controllers');
const {
  isAuthAdmin,
  isAuthAlumn,
} = require('../../middleware/auth.middleware');
const AsignaturasRoutes = express.Router();

AsignaturasRoutes.post('/create', [isAuthAdmin], create);
AsignaturasRoutes.delete('/delete/:id', [isAuthAdmin], deleteAsignatura);
AsignaturasRoutes.post('/addAlumn/:id', [isAuthAdmin], addAlumn);
AsignaturasRoutes.post('/addTeacher/:id', [isAuthAdmin], addTeacher);
AsignaturasRoutes.get('/curso/:curso', [isAuthAlumn], getNotasCurso);

module.exports = AsignaturasRoutes;
