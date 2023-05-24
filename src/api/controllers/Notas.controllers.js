const Asignatura = require('../models/Asignaturas.model');
const Notas = require('../models/Notas.model');
const User = require('../models/User.model');

const create = async (req, res, next) => {
  try {
    await Notas.syncIndexes();
    const { asignaturas } = req.user;
    const asignaturaString = asignaturas.toString();
    const newNota = new Notas({ ...req.body, asignatura: asignaturaString });
    const notaSave = await newNota.save();
    const { alumn } = req.body;
    const notaCreada = await Notas.findOne({
      asignatura: asignaturaString,
      alumn: req.body.alumn,
    });
    console.log(notaCreada);
    const alumnNoUpdate = await User.findById(alumn);
    await alumnNoUpdate.updateOne({
      $push: { notas: notaCreada._id },
    });
    console.log(asignaturas.toString());
    const asignaturaNoUpdate = await Asignatura.findById(
      asignaturas.toString()
    );
    await asignaturaNoUpdate.updateOne({
      $push: { nota: notaCreada._id },
    });
    if (notaSave) {
      return res.status(200).json(notaSave);
    } else {
      return res.status(404).json('no se ha podido crear la nota');
    }
  } catch (error) {
    return next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const allNotas = await Notas.find({ alumn: _id }).populate(
      'alumn asignatura'
    ); //_id === req.user._id
    const arrayAux = [];
    allNotas.forEach((element) => {
      console.log(1, element);
      arrayAux.push({
        [element.asignatura.year]: element.asignatura.curso,
        [element.asignatura.name]: element.nota,
      });
    });
    if (allNotas) {
      return res.status(200).json(arrayAux);
    } else {
      return res.status(404).json('ese alumno no tiene notas');
    }
  } catch (error) {
    return next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const { id } = req.params; //id asignatura
    const nota = await Notas.findOne({
      alumn: req.user._id,
      asignatura: id,
    }).populate('alumn asignatura');

    if (nota) {
      return res.status(200).json({
        [nota.asignatura.year]: nota.asignatura.curso,
        [nota.asignatura.name]: nota.nota,
      });
    } else {
      return res.status(404).json('Nota no encontrada');
    }
  } catch (error) {
    return next(error);
  }
};
const getMedia = async (req, res, next) => {
  try {
    const allNotas = await Notas.find({ alumn: req.user._id });
    let acc = 0;
    allNotas.forEach((element) => {
      const valor = element.nota;
      acc += valor;
    });
    const media = acc / allNotas.length;
    if (media) {
      return res.status(200).json(`la nota media es: ${media}`);
    } else {
      return res.status(404).json('error al calcular media');
    }
  } catch (error) {
    return next(error);
  }
};
const deleteNotas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notaToDelete = await Notas.findByIdAndDelete(id);
    if (notaToDelete) {
      const alumn = await User.findOne({ notas: id });
      await alumn.updateOne({
        $pull: { notas: id },
      });
      const asignatura1 = await Asignatura.findOne({ nota: id });
      await asignatura1.updateOne({
        $pull: { nota: id },
      });
      return res.status(200).json('ok delete');
    } else {
      return res.status(404).json('error al borrar');
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = { create, getAll, getById, getMedia, deleteNotas };
