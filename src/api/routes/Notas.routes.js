const express = require('express');
const {
  create,
  getAll,
  getById,
  getMedia,
  deleteNotas,
} = require('../controllers/Notas.controllers');
const NotasRoutes = express.Router();

module.exports = NotasRoutes;
