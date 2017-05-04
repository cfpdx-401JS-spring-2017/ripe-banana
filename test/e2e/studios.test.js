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

    it('returns validation error correctly', () => {
        return saveStudio({})
            .then(
            () => { throw new Error('expected failure'); },
            () => { }
            );
    });

    describe('saving studio with related model data', () => {


        let testStudio = {
            name: 'cool studio',
        };

// TODO: add in actor and casts field, right now I always get internal server error when 
// i do.
        // let testActor = {
        //     name: 'test actor',
        //     dob: 1456
        // };

        let testFilm = {
            title: 'test film',
            // cast: [{
                // actor: testActor._id,
                // role: 'test role'
            // }],
            released: 1950
        };

        function saveFilm(film) {
            film.studio = testStudio._id;
            return request
                .post('/films')
                .send(film)
                .then(res => res.body);
        }

        it('saved a studio with films', () => {
            return saveStudio(testStudio)
                .then(savedStudio => {
                    assert.ok(savedStudio._id);
                    testStudio = savedStudio;
                })
                .then(() => {
                    return saveFilm(testFilm)
                        .then(savedFilm => {
                            assert.ok(savedFilm._id);
                            assert.ok(savedFilm.studio);
                            assert.equal(savedFilm.studio, testStudio._id);
                            assert.ok(savedFilm.cast);
                            assert.equal(savedFilm.released, 1950);
                        });
                })
                .then(() => request.get(`/studios/${testStudio._id}`))
                .then(res => res.body)
                .then(studio => {
                    assert.deepEqual(studio.films, [{
                        title: studio.films[0].title,
                        _id: studio.films[0]._id,
                        released: studio.films[0].released,
                        cast: studio.films[0].cast
                    }]);
                });
        });
    });
});