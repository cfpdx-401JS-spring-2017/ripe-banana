const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());

const studios = require('./routes/studios');

app.use('/studios', studios);

module.exports = app;