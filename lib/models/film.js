const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Cast = require('./cast');

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  // cast: [Cast.schema]    TODO: per Marty, don't make cast schema or subdocument -- just insert that array here
});

module.exports = mongoose.model('Film', schema);