const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;


describe('films api', () => {

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

    let fakeFilm1 = null;
    let cast = [{ role: 'Cher', actor: fakeActor1._id }];

    fakeFilm1 = {
        title: 'Clueless',
        studio: fakeStudio1._id,
        released: 1995,
        cast: cast,
    };

    let fakeFilm2 = {
        title: 'Moonlight',
        studio: fakeStudio1._id,
        released: 2016,
        cast: cast,
    };

    let fakeFilm3 = {
        title: 'Last Waltz',
        studio: fakeStudio1._id,
        released: 1975,
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
        fakeFilm1.cast = [{ role: 'Cher', actor: fakeActor1._id }];
        return saveFilm(fakeFilm1)
            .then(savedFilm => {
                assert.ok(savedFilm._id, 'saved film has id');
                fakeFilm1 = savedFilm;
            })
            .then(() => {
                return request.get(`/api/films/${fakeFilm1._id}`);

            })
            .then(res => res.body)
            .then(gotFilm => {
                let expectedFilm = {
                    _id: fakeFilm1._id,
                    title: fakeFilm1.title,
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


    it('returns list of all film titles and their studio names', () => {
        fakeFilm2.cast = [{ role: 'Dude', actor: fakeActor1._id }];
        fakeFilm3.cast = [{ role: 'Levon', actor: fakeActor1._id }];

        return Promise.all([
            saveFilm(fakeFilm2),
            saveFilm(fakeFilm3),

        ])

            .then(savedFilm => {
                fakeFilm2 = savedFilm[0];
                fakeFilm3 = savedFilm[1];
            })

            .then(() => request.get('/api/films'))
            .then(res => res.body)
            .then(gotfilms => {
                assert.equal(gotfilms.length, 3);


                function test(fakeFilm) {

                    assert.include(gotfilms,
                        {
                            title: fakeFilm.title,
                            _id: fakeFilm._id,
                            studio: {
                                name: fakeStudio1.name,
                                _id: fakeStudio1._id,
                            }
                        });
                }

                test(fakeFilm1);
                test(fakeFilm2);
                test(fakeFilm3);

            });
    });


    it('updates films', () => {
        fakeFilm1.title = 'Fake Movie Title';
        return request.put(`/api/films/${fakeFilm1._id}`)
            .send(fakeFilm1)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.title, 'Fake Movie Title');
            });
    });

    it('deletes a film', () => {
        return request.delete(`/api/films/${fakeFilm1._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/api/films'))
            .then(res => res.body)
            .then(films => {
                assert.equal(films.length, 2);
            });
    });

    it('deletes a non-eistent film, returns removed false', () => {
        return request.delete(`/api/films/${fakeFilm1._id}`)
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



