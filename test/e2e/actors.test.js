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

  let fakeActor2 = {
    name: 'Alice N. Wonderland',
    dob: 1814
  };

  let fakeActor3 = {
    name: 'Liam Neeson',
    dob: 1960
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

  it('returns list of all actors', () => {
    return Promise.all([
      savedActor(fakeActor2),
      savedActor(fakeActor3)
    ])
      .then(newSavedActor => {
        fakeActor2 = newSavedActor[0];
        fakeActor3 = newSavedActor[1];
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

  it('deletes an actor', () => {
    return request.delete(`/api/actors/${fakeActor1._id}`)
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
});