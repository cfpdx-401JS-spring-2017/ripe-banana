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


    let fakeActor1 = {
        name: 'Alicia Silverstone',
        dob: 1981,

    };

    it('it saves an actor', () => {
        return request
            .post('/api/actors')
            .send(fakeActor1)
            .then(res => res.body)
            .then(savedActor => {
                assert.isOk(savedActor._id, 'has saved id');
                fakeActor1 = savedActor;
            });

    });

    let fakeStudio1 = {
        name: 'fake studio',
        address: {
            street: 'fake street',
            city: 'faketown',
            country: 'usa'
        }
    };

    it('it saves a studio', () => {
        return request
            .post('/api/studios')
            .send(fakeStudio1)
            .then(res => res.body)
            .then(savedStudio => {
                assert.isOk(savedStudio._id, 'studio has id');
                fakeStudio1 = savedStudio;
            });

    });

    let fakeFilm = null;
    let cast = [{ role: 'Cher', actor: fakeActor1._id }];

    fakeFilm = {
        title: 'Clueless',
        studio: fakeStudio1._id,
        released: 1995,
        cast: cast,
    };

    function saveFilm(film) {
        film.studio = fakeStudio1._id;
        return request
            .post('/api/films')
            .send(film)
            .then(res => res.body);

    }

    it('rountrips a new film and GETS /films/:id ', () => {
        fakeFilm.cast = [{ role: 'Cher', actor: fakeActor1._id }];
        return saveFilm(fakeFilm)
            .then(savedFilm => {
                assert.ok(savedFilm._id, 'saved film has id');
                fakeFilm = savedFilm;
            })
            .then(() => {
                return request.get(`/api/films/${fakeFilm._id}`);

            })
            .then(res => res.body)
            .then(gotFilm => {
                let expectedFilm = {
                    _id: fakeFilm._id,
                    title: fakeFilm.title,
                    cast: [{
                        actor: {
                            name: 'Alicia Silverstone',
                        },
                        role: 'Cher'
                    }],
                    studio: {
                        _id: fakeStudio1._id,
                        name: fakeStudio1.name

                    }
                };
                assert.deepEqual(gotFilm, expectedFilm);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const fakeId = '5201103b8896909da4402997';
        return request.get(`/api/films/${fakeId}`)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
    });

    // let film2 = {
    //     title: 'Moonlight',
    //     studio: fakeStudio1._id,
    //     released: 2016,
    //     cast: cast,
    // };

    // it('returns list of all film titles and their studio names', () => {

    //     return Promise.all([
    //         saveFilm(film),
    //         saveFilm(film2)
    //     ])

    //         .then(savedFilm => {
    //             film = savedFilm[0];
    //             film2 = savedFilm[1];
    //         })

    //         .then(() => request.get('/api/films'))
    //         .then(res => res.body)
    //         .then(films => {
    //             assert.equal(films.length, 2);
    //             function test(film) {
    //                 assert.include(films, [{ name: film.name, _id: film._id }]);
    //             }

    //             test(film);
    //             test(film2);

    //         });
    // });

    // describe('GET /films/:id', () => {   //Q: I did this in roundtrip, so no need to test again?
    //     let testFilm = null;
    //     before(() => {

    //         testFilm = {
    //             title: 'Clueless',
    //             studio: {
    //                 _id: fakeStudio1._id,
    //                 name: fakeStudio1.name

    //             },
    //             released: '1995',
    //         };
    //         return new Film(testFilm).save()
    //             .then(savedFilm => {
    //                 testFilm = savedFilm;
    //             });

    //     });

    it('updates films', () => {
        fakeFilm.title = 'Fake Movie Title';
        return request.put(`/api/films/${fakeFilm._id}`)
            .send(fakeFilm)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.title, 'Fake Movie Title');
            });
    });

    it('deletes a film', () => {
        return request.delete(`/api/films/${fakeFilm._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/api/films'))
            .then(res => res.body)
            .then(films => {
                assert.equal(films.length, 0);
            });
    });

    it('deletes a non-eistent film, returns removed false', () => {
        return request.delete(`/api/films/${fakeFilm._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation falure', () => {
        return saveFilm({})
            .then(
            () => { throw new Error('expected failure'); },
            () => { }
            );
    });



});



