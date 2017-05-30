const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cast = require('./cast');

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
    cast: [cast.schema]
});

module.exports = mongoose.model('Film', schema);