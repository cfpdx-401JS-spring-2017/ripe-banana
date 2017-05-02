const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('actors api', () => {

    before(db.drop);

    it.only('initial /GET returns empty list', () => {
        return request
            .get('/api/actors')
            .then(res => {
                const actors = res.body;
                assert.deepEqual(actors, []);
            });
    });

    let fakeHomie1 = {
        name: 'fake',
        likes: 'fake stuff',
    };

    let fakeHomie2 = {
        name: 'fake2',
        likes: 'lame stuff',
    };

    let fakeHomie3 = {
        name: 'fake3',
        likes: 'updated like',
    };

    function saveHomie(homie) {
        return request
            .post('/api/homies')
            .send(homie)
            .then(res => res.body);
    }

//roundtripping allows us to validate two actions in one
    it('rountrips a new homie', () => {
        return saveHomie(fakeHomie1)
            .then(savedHomie => {
                assert.ok(savedHomie._id, 'saved has id');
                fakeHomie1 = savedHomie;
            })
            .then(() => {
                return request.get(`/api/homies/${fakeHomie1._id}`);
            })
            .then(res => res.body)
            .then(gotHomie => {
                assert.deepEqual(gotHomie, fakeHomie1);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const fakeId = '5201103b8896909da4402997';
        return request.get(`/api/homies/${fakeId}`)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
    });

    it('returns list of all homies', () => {
        //promise.all adds both of those things together (?)
        return Promise.all([ //Promise.all returns a single promise that happens when all the promised within the argument have been resolved
            saveHomie(fakeHomie2),
            saveHomie(fakeHomie3)
        ])
            .then(savedHomie => {
                fakeHomie2 = savedHomie[0];
                fakeHomie3 = savedHomie[1];
            })
            .then(() => request.get('/api/homies'))
            .then(res => res.body)
            .then(homies => {
                assert.equal(homies.length, 3);
                assert.include(homies, fakeHomie1);
                assert.include(homies, fakeHomie2);
                assert.include(homies, fakeHomie3);
            });
    });

    
    it('updates homies', () => {
        fakeHomie3.likes = 'sprinkles';
        return request.put(`/api/homies/${fakeHomie3._id}`)
            .send(fakeHomie3)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.likes, 'sprinkles');
            });
    });

    it('deletes a homie', () => {
        return request.delete(`/api/homies/${fakeHomie3._id}`)
            .then(res => res.body) //must return res.body after send request
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/api/homies'))
            .then(res => res.body)
            .then(homies => {
                assert.equal(homies.length, 2);
            });
    });

    it('deletes a non-eistent homie, returns removed false', () => {
        return request.delete(`/api/homies/${fakeHomie3._id}`)
        .then(res => res.body)
        .then(result => {
            assert.isFalse(result.removed);
        });
    });

    it('errors on validation falure', () => {
        return saveHomie({})
        .then(
            () => { throw new Error('expected failure'); },
            () => { }
        );
    });


});