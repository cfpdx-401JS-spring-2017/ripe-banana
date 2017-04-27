const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('studios api', () => {

    before(db.drop);

    it('GETS all studios', () => {
        return request
            .get('/api/studios')
            .then(res => {
                const studios = res.body;
                assert.deepEqual(studios, []);
            });
    });
});