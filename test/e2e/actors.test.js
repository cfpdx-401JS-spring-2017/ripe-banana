const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('actors API', () => {

  before(db.drop);

  it('first GET returns empty array', () => {
    return request.get('/api/actors')
      .then(res => {
        const actors = res.body;
        assert.deepEqual(actors, []);
      });
  });

  let fakeActor = {
    name: 'Lief Garret',
    dob: 1974
  };

  function savedActor(actor) {
    return request
      .post('/api/actors')
      .send(actor)
      .then(res => res.body);
  }

  it('roundtrips an actor', () => {
    return savedActor(fakeActor)
      .then(savedActor => {
        assert.ok(savedActor._id, 'saved has id');
        fakeActor = savedActor;
      })
      .then(() => {
        return request.get(`/api/actors/${fakeActor._id}`);
      })
      .then(res => res.body)
      .then(got => {
        assert.deepEqual(got, fakeActor);
      });
  });

  it('deletes an actor', () => {
    return request.delete(`/api/actors/${fakeActor._id}`)
      .then(res => res.body)
      .then(result => {
        assert.isTrue(result.removed);
      })
      .then(() => request.get('/api/actors'))
      .then(res => res.body)
      .then(actors => {
        assert.equal(actors.length, 0);
      });
  });
});