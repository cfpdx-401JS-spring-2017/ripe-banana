const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const musicians = require('./routes/musicians');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/musicians', musicians);

module.exports = app;