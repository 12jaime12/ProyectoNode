const express = require('express');
const {
  register,
  verificarCodigo,
  loginUser,
  forgotPassword,
  ChangePassword,
  update,
  deleteUser,
  sendCode,
  sendPassword,
  getById,
  getAll,
  sendNewCode,
  updateEmail,
} = require('../controllers/User.controllers');
const { upload } = require('../../middleware/files.middleware');
const {
  isAuth,
  isAuthAlumn,
  isAuthAdmin,
} = require('../../middleware/auth.middleware');
const UserRoutes = express.Router();

UserRoutes.get('/register', upload.single('image'), register);
UserRoutes.post('/confirm/:id', verificarCodigo);
UserRoutes.post('/login', loginUser);
UserRoutes.delete('/', [isAuth], deleteUser);
UserRoutes.patch('/', [isAuth], ChangePassword);
UserRoutes.get('/forgotpassword', forgotPassword);
UserRoutes.patch('/update', [isAuth], upload.single('image'), update);
UserRoutes.get('/getById', [isAuthAlumn], getById);
UserRoutes.get('/getAll', [isAuthAdmin], getAll);
UserRoutes.get('/updateEmail', [isAuth], updateEmail);
//-------------------------redirects------------------------

UserRoutes.get('/register/sendMail/:id', sendCode);
UserRoutes.get('/sendPassword/:id', sendPassword);
UserRoutes.get('/sendNewCode/:id', sendNewCode);

module.exports = UserRoutes;
