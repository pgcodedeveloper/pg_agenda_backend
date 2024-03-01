const express = require('express');
const session = require('express-session');
const createError = require('http-errors');
const morgan = require('morgan');
const cors = require('cors');
const conectarDB = require('./config/db');

require('dotenv').config();

const app = express();

//Contect to database
conectarDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

//Enable the request from the client
app.use(cors({
  origin: process.env.FRONT_END,
}));

//Register the routers to API
app.use('/api/users', require('./routes/users/route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
