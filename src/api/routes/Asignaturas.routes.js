const express = require('express');
const {
  create,
  deleteAsignatura,
  addAlumn,
  addTeacher,
  getNotasCurso,
  getAlumnosAsignatura,
  getAllAsignaturas,
  getAllAsignaturasAlumn,
} = require('../controllers/Asignaturas.controllers');
const {
  isAuthAdmin,
  isAuthAlumn,
  isAuthTeacher,
} = require('../../middleware/auth.middleware');
const AsignaturasRoutes = express.Router();

AsignaturasRoutes.post('/create', [isAuthAdmin], create);
AsignaturasRoutes.delete('/delete/:id', [isAuthAdmin], deleteAsignatura);
AsignaturasRoutes.post('/addAlumn/:id', [isAuthAdmin], addAlumn);
AsignaturasRoutes.post('/addTeacher/:id', [isAuthAdmin], addTeacher);
AsignaturasRoutes.get('/curso/:curso', [isAuthAlumn], getNotasCurso);
AsignaturasRoutes.get('/alumns', [isAuthTeacher], getAlumnosAsignatura);
AsignaturasRoutes.get('/getAllAsignaturas', [isAuthAdmin], getAllAsignaturas);
AsignaturasRoutes.get(
  '/getAllAsignaturasAlumn',
  [isAuthAlumn],
  getAllAsignaturasAlumn
);

module.exports = AsignaturasRoutes;
