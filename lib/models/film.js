const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cast = require('./cast');

const schema = new Schema({
    title: {
        type: String,
        required: true,

    },
    studio: {  //QUESTION: could I require in the studio file and do this just like cast?
        type: Schema.Types.ObjectId,
        ref: 'Studio'
    },
    released: {
        type: Number,
        required: true
    },
    cast: [Cast.schema]
});

module.exports = mongoose.model('Film', schema);