const db = require('_db');
const request = require('_request');
const assert = require('chai').assert;

describe('studio API', () => {

    before(db.drop);

    it('GETs all studios', () => {
        return request.get('/api/studios')
        .then(res => {
            const studios = res.body;
            assert.deepEqual(studios, []);
        });
    });
});