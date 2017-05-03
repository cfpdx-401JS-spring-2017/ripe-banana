/* eslint-disable */
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ripe-banana'; 
mongoose.connect(dbUri);

//CONNECTION EVENTS
//When success:
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbUri);
});

//Connection error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error:' + err);
});

//Disconnect
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

//Disconnect when finished
process.on('SIGNIT', function () {
  mongoose.connection.close('disconnected', function () {
    console.log('Mongoose default connection disconnected through app terminal');
    process.exit(0);
  });
});