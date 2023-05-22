const { connect } = require('./src/utils/db');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { configCloudinary } = require('./src/middleware/files.middleware');

connect();
configCloudinary();
const app = express();
const PORT = process.env.PORT;

const cors = require('cors');
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

//routes

app.use('*', (req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  return next(error);
});

app.use((error, req, res) => {
  return res
    .status(error.status || 500)
    .json(error.message || 'Unexpected error');
});

app.disable('x-powered-by');
app.listen(PORT, () => {
  console.log(`Listening on PORT http://localhost:${PORT}`);
});
