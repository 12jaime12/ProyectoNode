const express = require('express');
const {
  register,
  verificarCodigo,
  loginUser,
  forgotPassword,
  ChangePassword,
  update,
  deleteUser,
  logout,
  getUsuariosCurso,
  sendCode,
} = require('../controllers/User.controllers');
const { upload } = require('../../middleware/files.middleware');
const { isAuth } = require('../../middleware/auth.middleware');
const UserRoutes = express.Router();

UserRoutes.get('/register', upload.single('image'), register);
UserRoutes.post('/confirm/:id', verificarCodigo);
UserRoutes.post('/login', loginUser);
UserRoutes.delete('/', [isAuth], deleteUser);
UserRoutes.patch('/', [isAuth], ChangePassword);
//-------------------------redirects------------------------

UserRoutes.get('/register/sendMail/:id', sendCode);

module.exports = UserRoutes;
