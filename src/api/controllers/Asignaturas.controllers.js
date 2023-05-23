const Asignatura = require('../models/Asignaturas.model');

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
      return res.status(404).json('no se ha encontrado la asignatura');
    }
  } catch (error) {
    return next(error);
  }
};
const addAlumn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { idAlumn } = req.body;

    const asignatura = await Asignatura.findById(id);
    const length1 = asignatura.alumn.length;
    asignatura.alumn.push(idAlumn);
    const length2 = asignatura.alumn.length;
    if (length1 + 1 === length2) {
      asignatura.save();
      return res.status(200).json(asignatura);
    } else {
      return res.status(404).json('error al añadir alumno');
    }
  } catch (error) {
    return next(error);
  }
};
const addTeacher = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

module.exports = { create, deleteAsignatura, addTeacher, addAlumn };
