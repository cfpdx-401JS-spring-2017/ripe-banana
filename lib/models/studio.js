const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        city: city
        state: state
        country: country
    }
});

module.exports = mongoose.model('Studio', schema);