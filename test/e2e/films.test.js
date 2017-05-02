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

    let film = null;
    let cast = [{ role: 'Cher', actor: fakeActor1._id }];

    film = {
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

    it('rountrips a new film', () => {
        film.cast = [{ role: 'Cher', actor: fakeActor1._id }];
        return saveFilm(film)
            .then(savedFilm => {
                assert.ok(savedFilm._id, 'saved film has id');
                film = savedFilm;
            })
            .then(() => {
                return request.get(`/api/films/${film._id}`);

            })
            .then(res => res.body)
            .then(gotFilm => {
                let expectedFilm = {
                    _id: film._id,
                    title: film.title,
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



});



