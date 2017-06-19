const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    rating: {
        type: Number, 
        min: 1, 
        max: 5,
        required: true,
    },
    review: {
        type: String,
        max: 150
    },
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    }
});

module.exports = mongoose.model('Reviews', schema);