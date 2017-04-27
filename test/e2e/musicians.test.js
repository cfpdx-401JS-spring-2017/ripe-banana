const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('musicians api', () => {
    
    before(db.drop);

    it('initial /GET returns empty list', () => {
        return request.get('/api/musicians')
            .then(req => {
                const musicians = req.body;
                assert.deepEqual(musicians, []);
            });
    });

    let tweety = {
        name: 'tweety',
        age: 22,
        songs: ['High Up', 'Fly UP', 'I know you']
    };

    let garfield = {
        name: 'garfield',
        age: 24,
        songs: ['High Up', 'Fly UP', 'I know you']
    };

    let nagini = {
        name: 'Nagini',
        age: 20,
        songs: ['High Up', 'Fly UP', 'I know you']
    };

    function saveMusician(musician) {
        return request
            // post our new musician    
            .post('/api/musicians')
            // send the data as the request body
            .send(musician)
            .then(res => res.body);
    }

    it('roundtrips a new Musician', () => {
        return saveMusician(tweety)
            .then(saved => {
                // check that we were assigned id
                assert.ok(saved._id, 'saved has id');
                // reassign saved version to our variable
                tweety = saved;
            })
            // go get this same pet by id
            .then(() => {
                return request.get(`/api/musicians/${tweety._id}`);
            })
            // get the data (pet) off they response body
            .then(res => res.body)
            .then(got => {
                // should be same as response from post
                assert.deepEqual(got, tweety);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const nonId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/api/musicians/${nonId}`)
            .then(
                () => { throw new Error('expected 404'); },
                res => {
                    assert.equal(res.status, 404);
                }  
            );
    });

    it('returns list of all musicians', () => {
        return Promise.all([
            saveMusician(garfield),
            saveMusician(nagini)
        ])
            .then(savedMusicians => {
                garfield = savedMusicians[0];
                nagini = savedMusicians[1];
            })
            .then(() => request.get('/api/musicians'))
            .then(res => res.body)
            .then(musicians => {
                assert.equal(musicians.length, 3);
                assert.include(musicians, tweety);
                assert.include(musicians, garfield);
                assert.include(musicians, nagini);
            });
    });

    it('updates musicians', () => {
        // human transform! :)
        nagini.age = 32;
        return request.put(`/api/musicians/${nagini._id}`)
            .send(nagini)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.age, 32);
            });
    });

    it('deletes a musicians', () => {
        return request.delete(`/api/musicians/${garfield._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/api/musicians'))
            .then(res => res.body)
            .then(musicians => {
                assert.equal(musicians.length, 2);
            });
    });

    it('delete a non-existent musician is removed false', () => {
        return request.delete(`/api/musicians/${garfield._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation failure', () => {
        return saveMusician({})
            .then(
                () => { throw new Error('expected failure'); },
                () => { }  
            );
    });

});