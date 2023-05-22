const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connect = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { name, host } = db.connection;

    console.log(`conectada en el host: ${host} con el nombre ${name}`);
  } catch (error) {
    console.log('no se ha conectado la bd ❌', error);
  }
};
module.exports = { connect };
