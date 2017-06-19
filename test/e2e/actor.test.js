const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('Actor api', () => {
    before(db.drop);

    let actor = {
        name: 'James Franco', 
        dob: '07/22/1985'
    };

    it('initial /GET returns empty list', () => {
        return request.get('/api/actors')
            .then(req => {
                const actors = req.body;
                assert.deepEqual(actors, []);
            });
    });

    function saveActor(actor) {
        return request  
            .post('/api/actors')
            .send(actor)
            .then(res => res.body);
    }

    it('roundtrips a new Actor', () => {
        return saveActor(actor)
            .then(saved => {
                assert.ok(saved._id, 'saved has id');
                actor = saved;
            })
            .then(() => {
                return request.get(`/api/actors/${actor._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, actor);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const nonId = '589d04a8b6695bbdfd310ef1';
        return request.get(`/api/actors/${nonId}`)
            .then(
                () => { throw new Error('expected 404'); },
                res => {
                    assert.equal(res.status, 404);
                }  
            );
    });
});