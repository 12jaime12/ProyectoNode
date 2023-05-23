const express = require('express');
const {
  register,
  verificarCodigo,
  loginUser,
  forgotPassword,
  ChangePassword,
  update,
  deleteUser,
  getUsuariosCurso,
  sendCode,
  sendPassword,
} = require('../controllers/User.controllers');
const { upload } = require('../../middleware/files.middleware');
const { isAuth } = require('../../middleware/auth.middleware');
const UserRoutes = express.Router();

UserRoutes.get('/register', upload.single('image'), register);
UserRoutes.post('/confirm/:id', verificarCodigo);
UserRoutes.post('/login', loginUser);
UserRoutes.delete('/', [isAuth], deleteUser);
UserRoutes.patch('/', [isAuth], ChangePassword);
UserRoutes.get('/forgotpassword', forgotPassword);
UserRoutes.patch('/update', [isAuth], upload.single('image'), update);
//-------------------------redirects------------------------

UserRoutes.get('/register/sendMail/:id', sendCode);
UserRoutes.get('/sendPassword/:id', sendPassword);

module.exports = UserRoutes;
