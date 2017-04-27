const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    age: {
        type: Number,
        required: true,
        min: 12,
        max: 100
    },
    songs: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Musician', schema);