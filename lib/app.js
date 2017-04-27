const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/status', (req, res) => {
  res.send('ok');
});
// const cookies = require('./routes/cookies');

// app.use('/api/cookies', cookies);

module.exports = app;