const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe.only('actors api', () => {

    before(db.drop);

    it('initial /GET returns empty list', () => {
        return request
            .get('/api/actors')
            .then(res => {
                const actors = res.body;
                assert.deepEqual(actors, []);
            });
    });

    let fakeActor1 = {
        name: 'fake',
        dob: 1981,
    };

    let fakeActor2 = {
        name: 'fake2',
        dob: 1985,
    };

    let fakeActor3 = {
        name: 'fake3',
        dob: 1982,
    };

    function saveActor(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(res => res.body);
    }

    it('rountrips a new actor', () => {
        return saveActor(fakeActor1)
            .then(savedActor => {
                assert.ok(savedActor._id, 'saved has id');
                fakeActor1 = savedActor;
            })
            .then(() => {
                return request.get(`/api/actors/${fakeActor1._id}`);
            })
            .then(res => res.body)
            .then(gotActor => {
                assert.deepEqual(gotActor, fakeActor1);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const fakeId = '5201103b8896909da4402997';
        return request.get(`/api/actors/${fakeId}`)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
    });

    it('returns list of all actors', () => {
        return Promise.all([
            saveActor(fakeActor2),
            saveActor(fakeActor3)
        ])
            .then(savedActor => {
                fakeActor2 = savedActor[0];
                fakeActor3 = savedActor[1];
            })
            .then(() => request.get('/api/actors'))
            .then(res => res.body)
            .then(actors => {
                assert.equal(actors.length, 3);
                function test(fakeActor) {
                    assert.include(actors, { name: fakeActor.name, _id: fakeActor._id, dob: fakeActor.dob });
                }

                test(fakeActor1);
                test(fakeActor2);
                test(fakeActor3);
            });
    });

    it('updates actors', () => {
        fakeActor3.name = 'updated fake';
        return request.put(`/api/actors/${fakeActor3._id}`)
            .send(fakeActor3)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.name, 'updated name');
            });
    });

    it('deletes a actor', () => {
        return request.delete(`/api/actors/${fakeActor3._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/api/actors'))
            .then(res => res.body)
            .then(actors => {
                assert.equal(actors.length, 2);
            });
    });

    it('deletes a non-existent actor, returns removed false', () => {
        return request.delete(`/api/actors/${fakeActor3._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation falure', () => {
        return saveActor({})
            .then(
            () => { throw new Error('expected failure'); },
            () => { }
            );
    });


});