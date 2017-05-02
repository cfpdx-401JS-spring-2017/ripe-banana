const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe.only('studio API', () => {

    before(db.drop);

    it('first GET returns empty array', () => {
        return request.get('/studios')
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
            .post('/studios')
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
                return request.get(`/studios/${bigStudio._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.equal(got._id, bigStudio._id);
            });
    });

    it('gets 404 for nonexistent id', () => {
        const notId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/studios/${notId}`)
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
            .then(() => request.get('/studios'))
            .then(res => res.body)
            .then(studios => {
                console.log('studios', studios, 'bigstudio',  bigStudio);
                assert.equal(studios.length, 2);
                assert.include(studios, {
                    _id: bigStudio._id,
                    name: bigStudio.name,
                    address: bigStudio.address
                });
                assert.include(studios, {
                    _id: littleStudio._id,
                    name: littleStudio.name,
                    address: littleStudio.address
                });
            });
    });

    it('updates a studio', () => {
        littleStudio.name = 'tiny studio';
        return request.put(`/studios/${littleStudio._id}`)
            .send(littleStudio)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.name, 'tiny studio');
            });
    });

    it('deletes a studio', () => {
        return request.delete(`/studios/${littleStudio._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/studios'))
            .then(res => res.body)
            .then(studios => {
                assert.equal(studios.length, 1);
            });
    });

    it('deleting a non-existent studio returns removed:false', () => {
        return request.delete(`/studios/${littleStudio._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('returns validation error correclty', () => {
        return saveStudio({})
            .then(
            () => { throw new Error('expected failure'); },
            () => { }
            );
    });

// TODO: refactor this to work with the implentation. partway done
    it('saved a studio with films', () => {
        let studio = {
            name: 'cool studio',
            address: {},
            films: [{
                films: studio.film._id
            }]
        };
        return saveStudio(studio)
            .then(saved => {
                studio = saved;
                assert.ok(studio.films.length);
            })
            .then(() => request.get(`/studios/${studio._id}`))
            .then(res => res.body)
            .then(studios => {
                assert.deepEqual(studios.films, [{
                    title: studio.film.title
                    // add other fields if needed
                }]);
            });
    });
});