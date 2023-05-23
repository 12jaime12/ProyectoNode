const express = require('express');
const {
  create,
  getAll,
  getById,
  getMedia,
  deleteNotas,
} = require('../controllers/Notas.controllers');
const {
  isAuthTeacher,
  isAuthAlumn,
} = require('../../middleware/auth.middleware');
const NotasRoutes = express.Router();

NotasRoutes.post('/create', [isAuthTeacher], create);
NotasRoutes.get('/allNotas', [isAuthAlumn], getAll);
NotasRoutes.get('/oneNota/:id', [isAuthAlumn], getById);
NotasRoutes.get('/media', [isAuthAlumn], getMedia);
NotasRoutes.delete('/delete/:id', [isAuthTeacher], deleteNotas);
module.exports = NotasRoutes;
