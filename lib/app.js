const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());

const studios = require('./routes/studios');
const actors = require('./routes/actors');


app.use('/studios', studios);
app.use('/actors', actors);

module.exports = app;