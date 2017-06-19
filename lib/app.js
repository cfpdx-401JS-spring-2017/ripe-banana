const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const studios = require('./routes/studios');
const actors = require('./routes/actors');
const films = require('./routes/films');


app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api/studios', studios);
app.use('/api/actors', actors);
app.use('/api/films', films);


module.exports = app;