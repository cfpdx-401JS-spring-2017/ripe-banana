const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('studio API', () => {

    before(db.drop);

    it('first GET returns empty array', () => {
        return request.get('/api/studios')
            .then(res => {
                const studios = res.body;
                assert.deepEqual(studios, []);
            });
    });

    let bigStudio = {
        name: 'big studio',
        address: {
            city: 'san francisco',
            state: 'california',
            country: 'united states'
        }
    };

    let littleStudio = {
        name: 'little studio',
        address: {
            city: 'portland',
            state: 'oregon',
            country: 'united states'
        }
    };

    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(res => res.body);
    }

    it('roundtrips a new studio', () => {
        return saveStudio(bigStudio)
            .then(saved => {
                assert.ok(saved._id);
                bigStudio = saved;
            })
            .then(() => {
                return request.get(`/api/studios/${bigStudio._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.equal(got._id, bigStudio._id);
            });
    });

    it('gets 404 for nonexistent id', () => {
        const notId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/api/studios/${notId}`)
            .then(
                () => { throw new Error('expected 404'); },
                res => {
                    assert.equal(res.status, 404);
                }
            );
    });

    it('gets all studios', () => {
        return saveStudio(littleStudio)
            .then(saved => {
                littleStudio = saved;
            })
            .then(() => request.get('/api/studios'))
            .then(res => res.body)
            .then(studios => {
                delete littleStudio.__v;
                delete bigStudio.__v;
                assert.equal(studios.length, 2);
                assert.include(studios, bigStudio);
                assert.include(studios, littleStudio);
            });
    });

    it('updates a studio', () => {
        littleStudio.name = 'tiny studio';
        return request.put(`/api/studios/${littleStudio._id}`)
            .send(littleStudio)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.name, 'tiny studio');
            });
    });
});