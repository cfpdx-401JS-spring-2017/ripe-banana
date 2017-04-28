const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String,
    required: true
  },

  studio: {
    type: Schema.Types.ObjectId,
    ref: 'Studio'
  },

  released: {
    type: Number,
    required: true
  }, 
  
  cast: [{
    role: String,
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'Actor'
    }
  }]
});

module.exports = mongoose.model('Film', schema);