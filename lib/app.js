const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());

const studios = require('./routes/studios');
const films = require('./routes/films');
const actors = require('./routes/actors');

app.use('/api/studios', studios);
app.use('/api/films', films);
app.use('/api/actors', actors);

module.exports = app;