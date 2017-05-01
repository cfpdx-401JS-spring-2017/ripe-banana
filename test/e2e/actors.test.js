const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('actor API', () => {

    before(db.drop);

    it('first GET returns empty array', () => {
        return request.get('/actors')
            .then(res => {
                const actors = res.body;
                assert.deepEqual(actors, []);
            });
    });

    const coolActor = {
        name: 'brad pitt',
        dob: 1043
    };

    function saveActor(actor) {
        return request
            .post('/actors')
            .send(actor)
            .then(res => res.body);
    }

    it('roundtrips an actor', () => {
        return saveActor(coolActor)
            .then(saved => {
                assert.ok(saved._id);
                saved = coolActor;
            })
            .then(() => {
                return request.get(`/actors/${coolActor._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.equal(got._id, coolActor._id);
            });
    });
});