const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
       
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    }
});

module.exports = mongoose.model('Studio', schema);