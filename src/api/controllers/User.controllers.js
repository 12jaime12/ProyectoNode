const { deleteImgCloudinary } = require('../../middleware/files.middleware');
const randomCode = require('../../utils/randomCode');
const User = require('../models/User.model');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { generateToken } = require('../../utils/token');
const randomPassword = require('../../utils/randomPassword');
const Asignatura = require('../models/Asignaturas.model');
const Notas = require('../models/Notas.model');
dotenv.config();

const register = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    await User.syncIndexes();
    let confirmationCode = randomCode();

    const userExist = await User.findOne(
      { email: req.body.email },
      { name: req.body.name }
    );
    if (!userExist) {
      console.log(req.body);
      const newUser = new User({
        ...req.body,
        confirmationCode,
      });
      if (req.file) {
        newUser.image = req.file.path;
      } else {
        newUser.image =
          'https://res.cloudinary.com/dtyjzv2xg/image/upload/v1684425422/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail_rgd7km.png';
      }

      const userSave = await newUser.save();

      if (userSave) {
        return res.redirect(
          307,
          `http://localhost:8087/api/v1/user/register/sendMail/${userSave._id}`
        );
      }
    } else {
      deleteImgCloudinary(catchImg);
      return res.status(409).json('this user already exist');
    }
  } catch (error) {
    return next(error);
  }
};
//---------------------redirect----------------sendCode----------------------------
const sendCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDB = await User.findById(id);
    const emailEnv = process.env.EMAIL;
    const password = process.env.PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailEnv,
        pass: password,
      },
    });

    const mailOptions = {
      from: emailEnv,
      to: userDB.email,
      subject: 'Confirmation code virtualSchool',
      text: `Gracias ${userDB.name} por registrarte en virtualSchool, aqui tienes tu código de verificación: ${userDB.confirmationCode} `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(404).json({
          user: userDB,
          confirmationCode: 'error, resend code',
        });
      } else {
        //console.log('email sent: ' + info.response);
        return res.status(200).json({
          user: userDB,
          confirmationCode: userDB.confirmationCode,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};
const verificarCodigo = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const userFalse = await User.findById(id);
    console.log(userFalse);
    const { code } = req.body;
    if (userFalse.confirmationCode === code) {
      try {
        await User.findByIdAndUpdate(id, { check: true });
      } catch (error) {
        return res.status(404).json(error.message);
      }
      const checkUser = await User.findById(id);
      return res.status(200).json({
        testCheckOk: checkUser.check == true ? true : false,
      });
    } else {
      const userNotExist = await User.findByIdAndDelete(id);
      if (userNotExist) {
        if (await User.findById(id)) {
          next('Error en el borrado');
        } else {
          deleteImgCloudinary(userFalse.image);
          return res.status(200).json({
            userNotExist,
            check: false,
            delete: (await User.findById(userNotExist._id))
              ? 'error delete user'
              : 'ok delete user',
          });
        }
        return res.status(200).json({
          deleteObject: deleteUser,
          test: (await User.findById(id)) ? 'no ok delete' : 'ok delete',
        });
      } else {
        return res.status(404).json('no se ha encontrado el usuario');
      }
    }
  } catch (error) {
    return next(error);
  }
};
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userToLogin = await User.findOne({ email });

    if (userToLogin) {
      if (bcrypt.compareSync(password, userToLogin.password)) {
        const token = generateToken(userToLogin._id, email);
        return res.status(200).json({
          user: userToLogin,
          token,
        });
      } else {
        return res.status(404).json('las contraseña no coincide');
      }
    } else {
      return res.status(404).json('user no registrado');
    }
  } catch (error) {
    return next(error);
  }
};
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userDb = await User.findOne({ email });
    if (userDb) {
      return res.redirect(
        307,
        `http://localhost:8087/api/v1/user/sendPassword/${userDb._id}`
      );
    } else {
      return res.status(404).json('usuario no registrado');
    }
  } catch (error) {
    return next(error);
  }
};
//---------------redirect-----------sendPassword-------------------
const sendPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const EMAIL = process.env.EMAIL;
    const PASSWORD = process.env.PASSWORD;

    let password2 = randomPassword();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: user.email,
      subject: 'Contraseña nueva VirtualSchool',
      text: `${user.name} Aqui tienes tu contraseña de un solo uso ${password2} Recuerde cambiarla una vez inicies sesión`,
    };

    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        return res.status(404).json('no se ha enviado el email');
      } else {
        const newPasswordHash = bcrypt.hashSync(password2, 10);
        await User.findByIdAndUpdate(id, { password: newPasswordHash });
        const userUpdate = await User.findById(id);
        if (bcrypt.compareSync(password2, userUpdate.password)) {
          return res.status(200).json({
            updateUser: true,
            sendPassword: true,
          });
        } else {
          return res.status(404).json({
            updateUser: false,
            sendPassword: true,
          });
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};
const ChangePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;
    const { _id } = req.user;
    if (bcrypt.compareSync(password, req.user.password)) {
      const newPasswordHashed = bcrypt.hashSync(newPassword, 10);
      await User.findByIdAndUpdate(_id, { password: newPasswordHashed });
      const newUserUpdate = await User.findById(_id);
      if (bcrypt.compareSync(newPassword, newUserUpdate.password)) {
        return res.status(200).json({
          userUpdate: true,
        });
      } else {
        return res.status(200).json({
          userUpdate: false,
        });
      }
    } else {
      return res.status(404).json('no coincide password');
    }
  } catch (error) {
    return next(error);
  }
};
const update = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    await User.syncIndexes();
    const newUser = new User(req.body);
    if (req.file) {
      newUser.image = req.file.path;
    }
    newUser._id = req.user._id;
    newUser.password = req.user.password;
    newUser.rol = req.user.rol;
    newUser.gender = req.user.gender;
    newUser.asignaturas = req.user.asignaturas;
    newUser.notas = req.user.notas;
    newUser.email = req.user.email;
    newUser.confirmationCode = req.user.confirmationCode;
    newUser.check = req.user.check;
    await User.findByIdAndUpdate(req.user._id, newUser);
    if (req.file) {
      deleteImgCloudinary(req.user.image);
    }

    const updateUser = await User.findById(req.user._id);
    const updateKeys = Object.keys(req.body);

    const testUpdate = [];
    updateKeys.forEach((item) => {
      if (updateUser[item] === req.body[item]) {
        testUpdate.push({
          [item]: true,
        });
      }
    });

    if (req.file) {
      updateUser.image == req.file.path
        ? testUpdate.push({
            file: true,
          })
        : testUpdate.push({
            file: false,
          });
    }
    return res.status(200).json({
      testUpdate,
    });
  } catch (error) {
    deleteImgCloudinary(catchImg);
    return next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { _id, image } = req.user;
    const deleteUser = await User.findByIdAndDelete(_id);
    if (deleteUser) {
      if (await User.findById(_id)) {
        next('Error en el borrado');
      } else {
        deleteImgCloudinary(image);

        const asignatura = await Asignatura.find({ alumn: _id });
        asignatura.forEach(async (element) => {
          await element.updateOne({
            $pull: { alumn: _id },
          });
        });

        // const notasAlumn = await Notas.find({ alumn: _id });
        // notasAlumn.forEach(async (element) => {
        //   const asignaturasNotas = await Asignatura.find({ nota: element._id });
        //   console.log(asignaturasNotas);
        //   await asignaturasNotas.updateOne({
        //     $pull: { nota: element._id },
        //   });
        //   await Notas.findByIdAndDelete(element._id);
        // });

        req.user.notas.forEach(async (element) => {
          await Notas.findByIdAndDelete(element._id);
          await Asignatura.updateMany(
            { nota: element },
            { $pull: { nota: element } }
          );
        });
      }
      return res.status(200).json({
        deleteObject: deleteUser,
        test: (await User.findById(_id)) ? 'no ok delete' : 'ok delete',
      });
    } else {
      return res.status(404).json('no se ha encontrado el usuario');
    }
  } catch (error) {
    return next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const alumn = await User.findById(req.user._id).populate(
      'asignaturas notas'
    );
    if (alumn) {
      return res.status(200).json(alumn);
    } else {
      return res
        .status(404)
        .json('El usuario id introducido no corresponde a ningun usuario');
    }
  } catch (error) {
    return next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    const allAlumns = await User.find({ rol: 'alumn' }).populate(
      'asignaturas notas'
    );
    if (allAlumns) {
      return res.status(200).json(allAlumns);
    } else {
      return res.status(404).json('no existen alumnos');
    }
  } catch (error) {
    return next(error);
  }
};
const updateEmail = async (req, res, next) => {
  try {
    await User.syncIndexes();
    let confirmationCode = randomCode();
    const { email } = req.body;
    if (req.user.email != email) {
      await User.findByIdAndUpdate(req.user._id, {
        email: email,
        check: false,
        confirmationCode: confirmationCode,
      });
      return res.redirect(
        `http://localhost:8087/api/v1/user/sendNewCode/${req.user._id}`
      );
    } else {
      return res.status(404).json('Debe meter un email distinto al anterior');
    }
  } catch (error) {
    return next(error);
  }
};
const sendNewCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDB = await User.findById(id);
    const emailEnv = process.env.EMAIL;
    const password = process.env.PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailEnv,
        pass: password,
      },
    });

    const mailOptions = {
      from: emailEnv,
      to: userDB.email,
      subject: 'Confirmation code virtualSchool',
      text: `${userDB.name} has cambiado tu email de virtualSchool, aqui tienes tu nuevo código de verificación: ${userDB.confirmationCode} `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(404).json({
          user: userDB,
          confirmationCode: 'error, resend code',
        });
      } else {
        console.log('email sent: ' + info.response);
        return res.status(200).json({
          email: 'enviado',
          code: userDB.confirmationCode,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};
const getAllAlumn = async (req, res, next) => {
  try {
    const allUser = await User.find({ rol: 'alumn' });
    if (allUser) {
      return res.status(200).json(allUser);
    } else {
      return res.status(404).json('error al encontrar alumnos');
    }
  } catch (error) {
    return next(error);
  }
};
const getAllTeacher = async (req, res, next) => {
  try {
    const allTeacher = await User.find({ rol: 'teacher' }).populate(
      'asignaturas'
    );
    if (allTeacher) {
      return res.status(200).json(allTeacher);
    } else {
      return res.status(404).json('error al encontrar teacher');
    }
  } catch (error) {
    return next(error);
  }
};
const changeRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    user.rol = 'teacher';

    if (user.rol === 'teacher') {
      return res.status(200).json(user);
    } else {
      return res.status(404).json('error al actualizar rol');
    }
  } catch (error) {
    return next(error);
  }
};
const autoLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (userDB) {
      if ((password, userDB.password)) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json('password dont match');
      }
    } else {
      return res.status(404).json('User no register');
    }
  } catch (error) {
    return next(error);
  }
};
const getCursoActual = async (req, res, next) => {
  try {
    const fechaActual = new Date();
    const annoActual = fechaActual.getFullYear();
    const id = req.user._id;
    const asignaturaActual = await Asignatura.findOne({
      year: annoActual,
      alumn: id,
    });
    if (asignaturaActual) {
      return res.status(200).json(asignaturaActual.curso);
    } else {
      return res.status(404).json('error al encontrar asignaturas actuales');
    }
  } catch (error) {
    return next(error);
  }
};
const getCursoTodosAlumns = async (req, res, next) => {
  try {
    const fechaActual = new Date();
    const annoActual = fechaActual.getFullYear();
    const alumns = await User.find({ rol: 'alumn' }).populate('asignaturas');
    const arrayAux = [];
    alumns.forEach((element) => {
      element.asignaturas.forEach((asignatura) => {
        if (asignatura.year === annoActual && asignatura.curso === '2ESO') {
          if (!arrayAux.includes(element)) {
            arrayAux.push(element);
          }
        }
      });
    });
    console.log(arrayAux);
  } catch (error) {
    return next(error);
  }
};
const getMisAlumns = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.user._id).populate('asignaturas');
    const idAsig = teacher.asignaturas[0]._id.toString();
    const asignatura = await Asignatura.findById(idAsig).populate('alumn');
    if (asignatura) {
      return res.status(200).json(asignatura);
    } else {
      return res.status(404).json('no existe asignatura');
    }
  } catch (error) {
    return next(error);
  }
};
module.exports = {
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
  getAllAlumn,
  getAllTeacher,
  changeRol,
  autoLogin,
  getCursoActual,
  getMisAlumns,
  getCursoTodosAlumns,
};
