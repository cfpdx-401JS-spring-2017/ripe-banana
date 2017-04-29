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



    it('returns list of the film title associated with a studio id', () => {
        let testFilm = {
            title: 'Clueless',
            studio: 'fakeStudio3'
        }

        return request
            .get(`/api/studios/${fakeStudio3._id}`) //trying to make it return {name, address, films}
            .then(res => {
                const studio = res.body
                assert.deepEqual('', )

            })



        let fakeStudio1 = {
            name: 'fake studio',
            address: {
                city: 'faketown',
                state: 'califeaux',
                country: 'usa'
            }
        };

        let fakeStudio2 = {
            name: 'fake studio2',
            address: {
                city: 'fakertown',
                state: 'califeaux',
                country: 'usa'

            }

        };

        let fakeStudio3 = {
            name: 'fake studio3',
            address: {
                city: 'fakesttown',
                state: 'califeaux',
                country: 'usa'

            }

        };


        function saveStudio(studio) {
            return request
                .post('/api/studios')
                .send(studio)
                .then(res => res.body);

        }

        it('rountrips a new studio', () => {
            return saveStudio(fakeStudio1)
                .then(savedStudio => {
                    assert.ok(savedStudio._id, 'saved has id');
                    fakeStudio1 = savedStudio;
                })
                .then(() => {
                    return request.get(`/api/studios/${fakeStudio1._id}`);
                })
                .then(res => res.body)
                .then(gotStudio => {
                    assert.deepEqual(gotStudio, fakeStudio1);
                });
        });

        it('GET returns 404 for non-existent id', () => {
            const fakeId = '5201103b8896909da4402997';
            return request.get(`/api/studios/${fakeId}`)
                .then(
                () => { throw new Error('expected 404'); },
                res => {
                    assert.equal(res.status, 404);
                }
                );
        });

        it('returns list of all studios', () => {

            return Promise.all([
                saveStudio(fakeStudio2),
                saveStudio(fakeStudio3)
            ])
                .then(savedStudio => {
                    fakeStudio2 = savedStudio[0];
                    fakeStudio3 = savedStudio[1];
                })
                .then(() => request.get('/api/studios'))
                .then(res => res.body)
                .then(studios => {
                    assert.equal(studios.length, 3);
                    assert.include(studios, fakeStudio1);
                    assert.include(studios, fakeStudio2);
                    assert.include(studios, fakeStudio3);
                });
        });










        it('updates studios', () => {
            fakeStudio3.name = 'Patton Pictures';
            return request.put(`/api/studios/${fakeStudio3._id}`)
                .send(fakeStudio3)
                .then(res => res.body)
                .then(updated => {
                    assert.equal(updated.name, 'Patton Pictures');
                });
        });

        it('deletes a studio', () => {
            return request.delete(`/api/studios/${fakeStudio3._id}`)
                .then(res => res.body)
                .then(result => {
                    assert.isTrue(result.removed);
                })
                .then(() => request.get('/api/studios'))
                .then(res => res.body)
                .then(studios => {
                    assert.equal(studios.length, 2);
                });
        });

        it('deletes a non-eistent studio, returns removed false', () => {
            return request.delete(`/api/studios/${fakeStudio3._id}`)
                .then(res => res.body)
                .then(result => {
                    assert.isFalse(result.removed);
                });
        });

        it('errors on validation falure', () => {
            return saveStudio({})
                .then(
                () => { throw new Error('expected failure'); },
                () => { }
                );
        });


    });

