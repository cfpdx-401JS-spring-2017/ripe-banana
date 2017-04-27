const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');


app.use(morgan('dev'));
app.use(bodyParser.json());

// app.get('/status', (req, res) => {
//   res.send('ok');
// });

const studios = require('./routes/studios');
// const stores = require('./routes/stores');

app.use('/api/studios', studios);
// app.use('/api/stores', stores);

module.exports = app;