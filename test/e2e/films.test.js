const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;
// const Film = require('../../lib/models/film');
// const Studio = require('../../lib/models/studio');
// const Cast = require('../../lib/models/cast');


describe.only('films api', () => {

    before(db.drop);

    it('GETS all films', () => {
        return request
            .get('/api/films')
            .then(res => {
                const films = res.body;
                assert.deepEqual(films, []);
            });
    });
});