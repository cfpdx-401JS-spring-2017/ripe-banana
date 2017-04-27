const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

/* RUN OUR APP */
const app = require('../../lib/app');
module.exports = chai.request(app);