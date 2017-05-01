const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    role: {
        type: String,
        required: true
    },
    actor: {
        type: Schema.Types.ObjectId,
        ref: 'Actors',
        required: true
    }
});

module.exports = mongoose.model('Cast', schema);