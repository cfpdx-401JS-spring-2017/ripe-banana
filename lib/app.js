const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');



app.use(morgan('dev'));
app.use(bodyParser.json());



// const homies = require('./routes/homies');
// const siblings = require('./routes/siblings');

// app.use('/api/homies', homies);
// app.use('/api/siblings', siblings); 

module.exports = app;