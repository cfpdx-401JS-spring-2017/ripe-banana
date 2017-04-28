const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');



app.use(morgan('dev'));
app.use(bodyParser.json());

//is our app up and running?
app.get('/status', (req, res) => {
    res.send('ok');

});


const studios = require('./routes/studios');
const films = require('./routes/films');

app.use('/api/studios', studios);
app.use('/api/films', films);

module.exports = app;