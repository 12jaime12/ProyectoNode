const User = require('../api/models/User.model');
const { verifyToken } = require('../utils/token');
const dotenv = require('dotenv');
dotenv.config();

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Unauthorized'));
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(error);
  }
};
const isAuthAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return next(new Error('Unauthorized'));
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (req.user.rol !== 'admin') {
      return next(new Error('Unauthorized, not admin'));
    }
    next();
  } catch (error) {
    return next(error);
  }
};
const isAuthAlumn = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return next(new Error('Unauthorized'));
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (req.user.rol !== 'alumn') {
      return next(new Error('Unauthorized, not alumn'));
    }
    next();
  } catch (error) {
    return next(error);
  }
};
const isAuthTeacher = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return next(new Error('Unauthorized'));
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (req.user.rol !== 'teacher') {
      return next(new Error('Unauthorized, not teacher'));
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  isAuth,
  isAuthAdmin,
  isAuthAlumn,
  isAuthTeacher,
};
