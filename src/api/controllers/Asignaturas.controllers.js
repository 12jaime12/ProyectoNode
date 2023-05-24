const Asignatura = require('../models/Asignaturas.model');
const User = require('../models/User.model');
const Notas = require('../models/Notas.model');

const create = async (req, res, next) => {
  try {
    const newAsignatura = new Asignatura(req.body);
    const AsignaturaSave = await newAsignatura.save();
    if (AsignaturaSave) {
      return res.status(200).json(AsignaturaSave);
    } else {
      return res.status(404).json('error en la creacion de Asignatura');
    }
  } catch (error) {
    return next(error);
  }
};
const deleteAsignatura = async (req, res, next) => {
  try {
    const { id } = req.params;
    const AsignaturaDelete = await Asignatura.findByIdAndDelete(id);
    if (AsignaturaDelete) {
      if (await Asignatura.findById(id)) {
        next('Error en el borrado de la asignatura');
      }
      return res.status(200).json({
        deleteObject: AsignaturaDelete,
        test: (await Asignatura.findById(id)) ? 'no ok delete' : 'ok delete',
      });
    } else {
      return res.status(404).json('no se ha encontrado el id de la asignatura');
    }
  } catch (error) {
    return next(error);
  }
};
const addAlumn = async (req, res, next) => {
  try {
    const { id } = req.params; //id asignatura
    const { idAlumn } = req.body;

    const alumn = await User.findById(idAlumn);
    const asignaturaNoUpdate = await Asignatura.findById(id);

    await asignaturaNoUpdate.updateOne({
      $push: { alumn: alumn._id },
    });

    await alumn.updateOne({
      $push: { asignaturas: asignaturaNoUpdate._id },
    });

    const asignaturaUpdate = await Asignatura.find({ alumn: alumn._id });
    console.log(asignaturaUpdate);

    if (asignaturaUpdate) {
      return res.status(200).json(asignaturaUpdate);
    } else {
      return res.status(404).json('error al añadir alumno');
    }
  } catch (error) {
    return next(error);
  }
};
const addTeacher = async (req, res, next) => {
  try {
    const { idteacher } = req.body;
    const { id } = req.params; //id asignatura
    const asignaturaNoUpdate = await Asignatura.findById(id);
    const teacher = await User.findById(idteacher);

    await asignaturaNoUpdate.updateOne({
      $push: { teacher: teacher._id },
    });

    await teacher.updateOne({
      $push: { asignaturas: asignaturaNoUpdate._id },
    });

    const asignaturaUpdate = await Asignatura.findById(id);
    if (asignaturaUpdate.teacher.length > 0) {
      return res.status(200).json(asignaturaUpdate);
    } else {
      return res.status(404).json('no se ha introducido correctamente');
    }
  } catch (error) {
    return next(error);
  }
};
const getNotasCurso = async (req, res, next) => {
  try {
    const { curso } = req.params;
    const findNotas = await Notas.find({ alumn: req.user._id }).populate(
      'asignatura'
    );
    const arrayAux = [];
    findNotas.forEach((element) => {
      if (element.asignatura.curso === curso) {
        arrayAux.push({ [element.asignatura.name]: element.nota });
      }
    });
    return res.status(200).json(arrayAux);
  } catch (error) {
    return next(error);
  }
};
const getAlumnosAsignatura = async (req, res, next) => {
  try {
    const { asignaturas } = req.user;
    const notasMiAsignatura = await Notas.find({
      asignatura: asignaturas.toString(),
    }).populate('alumn');
    const miAsignatura = await Asignatura.findById(asignaturas.toString());
    //console.log(notasMiAsignatura);
    const notasAlumns = [];
    notasMiAsignatura.forEach((element) => {
      notasAlumns.push({ [element.alumn.name]: element.nota });
    });
    if (notasAlumns) {
      return res.status(200).json({
        [miAsignatura.name]: miAsignatura.curso,
        notasAlumns,
      });
    } else {
      return res
        .status(404)
        .json('no se han conseguido las notas de tus alumnos');
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
  deleteAsignatura,
  addTeacher,
  addAlumn,
  getNotasCurso,
  getAlumnosAsignatura,
};
