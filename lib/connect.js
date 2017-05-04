/* eslint no-console: "off" */
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studios';

mongoose.connect(dbUri);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${dbUri}`);
});

mongoose.connection.on('error', err => {
  console.log(`Mongoose default connection error ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

mongoose.connection.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});