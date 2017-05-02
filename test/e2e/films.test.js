const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('film API', () => {

    before(db.drop);

    let studio = { name: 'testStudio' };
    before(() => {
        return request.post('/studios')
            .send(studio)
            .then(res => res.body)
            .then(saved => studio = saved);
    });

    it('first GET returns empty array', () => {
        return request.get('/films')
            .then(res => {
                const films = res.body;
                assert.deepEqual(films, []);
            });
    });

    let simpsons = {
        title: 'simpsons',
        released: 1920,
    };

    let bigTrouble = {
        title: 'big trouble in little china',
        released: 1980
    };

    function savefilm(film) {
        film.studio = studio._id;
        return request
            .post('/films')
            .send(film)
            .then(res => res.body);
    }

    it('roundtrips a new film', () => {
        return savefilm(simpsons)
            .then(saved => {
                assert.ok(saved._id);
                simpsons = saved;
            })
            .then(() => {
                return request.get(`/films/${simpsons._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.equal(got._id, simpsons._id);
            });
    });

    it('gets 404 for nonexistent id', () => {
        const notId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/films/${notId}`)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
    });

    it('gets all films', () => {
        return savefilm(bigTrouble)
            .then(saved => {
                bigTrouble = saved;
            })
            .then(() => request.get('/films'))
            .then(res => res.body)
            .then(films => {
                assert.equal(films.length, 2);
                assert.include(films, {
                    _id: simpsons._id,
                    title: simpsons.title
                });
                assert.include(films, {
                    _id: bigTrouble._id,
                    title: bigTrouble.title
                });
            });
    });

    it('updates a film', () => {
        simpsons.released = 1925;
        return request.put(`/films/${simpsons._id}`)
            .send(simpsons)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.released, 1925);
            });
    });

    it('deletes a film', () => {
        return request.delete(`/films/${simpsons._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/films'))
            .then(res => res.body)
            .then(films => {
                assert.equal(films.length, 1);
            });
    });

    it('deleting a non-existent film returns removed:false', () => {
        return request.delete(`/films/${simpsons._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('returns validation error correclty', () => {
        return savefilm({})
            .then(
            () => { throw new Error('expected failure'); },
            () => { }
            );
    });

    let actor = {
        name: 'actor mcactorface',
        dob: 1456
    };

    before(() => {
        return request.post('/actors')
            .send(actor)
            .then(res => res.body)
            .then(saved => actor = saved);
    });

    it('saved a film with films', () => {
        let coolFilm = {
            title: 'cool film',
            cast: [{
                actor: actor._id,
                role: 'cool role'
            }],
            studio: studio._id,
            released: 1987
        };

        return savefilm(coolFilm)
            .then(savedFilm => coolFilm = savedFilm)
            .then(() => request.get(`/films/${coolFilm._id}`))
            .then(res => res.body)
            .then(film => {
                assert.deepEqual(film, {
                    _id: coolFilm._id,
                    title: coolFilm.title,
                    cast: [{
                        _id: coolFilm.cast[0]._id,
                        actor: {
                            _id: actor._id, 
                            name: actor.name
                        },
                        role: coolFilm.cast[0].role
                    }],
                    studio: {
                        _id: studio._id,
                        name: studio.name
                    },
                    released: coolFilm.released
                });
            });
    });
});