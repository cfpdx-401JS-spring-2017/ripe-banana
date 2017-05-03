//this connects to mongo
process.env.MONGODB_URI = 'mongodb://localhost:27017/ripe-banana-test';
require('../../lib/connect');
const connection = require('mongoose').connection;


//this export a helper for dropping the db
module.exports = {
    drop() {
        return connection.dropDatabase();
    }
};