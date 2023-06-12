const Asignatura = require('../models/Asignaturas.model');
const User = require('../models/User.model');
const Notas = require('../models/Notas.model');

const create = async (req, res, next) => {
  try {
    await Asignatura.syncIndexes();
    const newAsignatura = new Asignatura(req.body);
    const AsignaturaSave = await newAsignatura.save();
    if (AsignaturaSave) {
      return res.status(200).json({ [AsignaturaSave.name]: 'creada' });
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

    const alumns = await User.find({ asignaturas: id });
    alumns.forEach(async (element) => {
      await element.updateOne({
        $pull: { asignaturas: id },
      });
    });
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
    if (!asignaturaNoUpdate.alumn.includes(alumn._id)) {
      await asignaturaNoUpdate.updateOne({
        $push: { alumn: alumn._id },
      });
      await alumn.updateOne({
        $push: { asignaturas: asignaturaNoUpdate._id },
      });
      return res.status(200).json('alumno creado');
    } else {
      await asignaturaNoUpdate.updateOne({
        $pull: { alumn: alumn._id },
      });
      await alumn.updateOne({
        $pull: { asignaturas: asignaturaNoUpdate._id },
      });
      return res.status(200).json('alumno eliminado');
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

    if (!asignaturaNoUpdate.teacher.includes(teacher._id)) {
      await asignaturaNoUpdate.updateOne({
        $push: { teacher: teacher._id },
      });
      await teacher.updateOne({
        $push: { asignaturas: asignaturaNoUpdate._id },
      });
      return res.status(200).json('profesor añadido');
    } else {
      await asignaturaNoUpdate.updateOne({
        $pull: { teacher: teacher._id },
      });
      await teacher.updateOne({
        $pull: { asignaturas: asignaturaNoUpdate._id },
      });
      return res.status(200).json('profesor eliminado');
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
        arrayAux.push({
          asignatura: element.asignatura.name,
          nota: element.nota,
        });
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
    const notasAlumns = [];
    notasMiAsignatura.forEach((element) => {
      console.log(element);
      notasAlumns.push({
        _id: element.alumn._id,
        nota: element.nota,
        name: element.alumn.name,
        image: element.alumn.image,
      });
    });
    if (notasAlumns) {
      return res.status(200).json({
        curso: miAsignatura.curso,
        name: miAsignatura.name,
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
const getAllAsignaturas = async (req, res, next) => {
  try {
    const getAllAsignaturas = await Asignatura.find();
    if (getAllAsignaturas) {
      return res.status(200).json(getAllAsignaturas);
    } else {
      return res.status(404).json('error al encontrar asignaturas');
    }
  } catch (error) {
    return next(error);
  }
};
const getAllAsignaturasAlumn = async (req, res, next) => {
  try {
    const getAllAsignaturas = await Asignatura.find({ alumn: req.user._id });
    if (getAllAsignaturas) {
      return res.status(200).json(getAllAsignaturas);
    } else {
      return res.status(404).json('error al encontrar asignaturas');
    }
  } catch (error) {
    return next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const asignatura = await Asignatura.findById(id);
    if (asignatura) {
      return res.status(200).json(asignatura);
    } else {
      return res.status(404).json('error al encontrar la asignatura');
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
  getAllAsignaturas,
  getAllAsignaturasAlumn,
  getById,
};
