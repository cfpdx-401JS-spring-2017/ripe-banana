const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require('./cast');

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
    // cast: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Cast',
    //     required: true
    // }
});

module.exports = mongoose.model('Film', schema);