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

  let fakeActor1 = {
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
    return savedActor(fakeActor1)
      .then(savedActor => {
        assert.ok(savedActor._id, 'saved has id');
        fakeActor1 = savedActor;
      })
      .then(() => {
        return request.get(`/api/actors/${fakeActor1._id}`);
      })
      .then(res => res.body)
      .then(got => {
        assert.deepEqual(got, fakeActor1);
      });
  });

  it('updates actors', () => {
    fakeActor1.name = 'Jeremy';
    return request.put(`/api/actors/${fakeActor1._id}`)
      .send(fakeActor1)
      .then(res => res.body)
      .then(updated => {
        assert.equal(updated.name, 'Jeremy');
      });
  });

  it('deletes an actor', () => {
    return request.delete(`/api/actors/${fakeActor1._id}`)
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