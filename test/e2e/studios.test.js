
const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('Studios api', () => {
    before(db.drop);

    it('initial /GET returns one studio list', () => {
        return request.get('/api/studios')
            .then(req => {
                const studios = req.body;
                assert.deepEqual(studios.length, 1);
            });
    });

    let summerTime = {
        name: 'SummerTime Studios',
        address: {
            city: 'Pasadena' ,
            state: 'CA',
            country: 'USA'
        }
    };

    let garfield = {
        name: 'Garfield Studios',
        address: {
            city: 'Beverly Hills' ,
            state: 'CA',
            country: 'USA'
        }
    };

    let warnerbros = {
        name: 'Warner Brothers Studios',
        address: {
            city: 'Los Angeles' ,
            state: 'CA',
            country: 'USA'
        }
    };

    function saveStudio(studio) {
        return request   
            .post('/api/studios')
            .send(studio)
            .then(res => studio = res.body);
    }

    // it('roundtrips a new Studio', () => {
    //     return saveStudio(summerTime)
    //         .then(saved => {
    //             // check that we were assigned id
    //             assert.ok(saved._id, 'saved has id');
    //             // reassign saved version to our variable
    //             summerTime = saved;
    //         })
    //         // go get this same pet by id
    //         .then(() => {
    //             return request.get(`/api/studios/${summerTime._id}`);
    //         })
    //         // get the data (pet) off they response body
    //         .then(res => res.body)
    //         .then(got => {
                
    //             // should be same as response from post
    //             assert.deepEqual(got, summerTime);
    //         });
    // });

    it('GET returns 404 for non-existent id', () => {
        const nonId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/api/studios/${nonId}`)
            .then(
                () => { throw new Error('expected 404'); },
                res => {
                    assert.equal(res.status, 404);
                }  
            );
    });

    let studio1 = {
        name: 'SS Studios',
        address: {
            city: 'Pasadena' ,
            state: 'CA',
            country: 'USA'
        }
    };

    before( () => {   
        return request.post('/api/studios')
            .send(studio1)
            .then (res => studio1 = res.body);
    });

    let film = null;
    before( () => {
        film = {
            title: 'O Brother',
            studio: studio1._id,
            released: '08/23/1989',
            cast: []
        };
        return request.post('/api/films')
            .send(film)
            .then (res => film = res.body);
    });

    let filmTwo = null;
    before( () => {
        filmTwo = {
            title: 'My Hitta my Hitta',
            studio: studio1._id,
            released: '08/23/1989',
            cast: []
        };
        return request.post('/api/films')
            .send(filmTwo)
            .then (res => filmTwo = res.body);
    });

    it('tests for the /:id in the Studio', () => {
        return request.get(`/api/studios/${studio1._id}`)
            .then(res => {
                studio1 = res.body;
                let obj = {
                    __v: 0,
                    _id: studio1._id,
                    name: 'SS Studios',
                    address: {
                        city: 'Pasadena',
                        state: 'CA',
                        country: 'USA'
                    },
                    films: [film.title, filmTwo.title]
                };
                assert.deepEqual(studio1, obj);
            });
    });

    it('returns list of all studios', () => {
        return Promise.all([
            saveStudio(garfield),
            saveStudio(summerTime),
            saveStudio(warnerbros)
        ])
            .then(savedStudios => {
                garfield = savedStudios[0];
                warnerbros = savedStudios[1];
                summerTime = savedStudios[2];
            })
            .then(() => request.get('/api/studios'))
            .then(res => res.body)
            .then(studios => {
                assert.equal(studios.length, 4);
                assert.include(studios, summerTime);
                assert.include(studios, garfield);
                assert.include(studios, warnerbros);
            });
    });

    it('updates studios', () => {
        // human transform! :)
        warnerbros.name = 'WarnerBros';
        return request.put(`/api/studios/${warnerbros._id}`)
            .send(warnerbros)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.name, 'WarnerBros');
            });
    });

    it('deletes a studios', () => {
        return request.delete(`/api/studios/${garfield._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/api/studios'))
            .then(res => res.body)
            .then(studios => {
                assert.equal(studios.length, 3);
            });
    });

    it('delete a non-existent studio is removed false', () => {
        return request.delete(`/api/studios/${garfield._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation failure', () => {
        return saveStudio({})
            .then(
                () => { throw new Error('expected failure'); },
                () => { }  
            );
    });
});