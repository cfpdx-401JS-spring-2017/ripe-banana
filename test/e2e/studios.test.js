const request = require('./_request');
const db = require('./_db');
const assert = require('chai').assert;

describe('Studios API', () => {

  before(db.drop);

  it('GET / all studios', () => {
    return request.get('/api/studios')
      .then(res => {
        const studios = res.body;
        assert.deepEqual(studios, []);
      });
  });

  let paramount = {
    name: 'Paramount',
    address: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    }
  };

  let laika = {
    name: 'Laika',
    address: {
      city: 'Portland',
      state: 'OR',
      country: 'USA'
    }
  };

  function saveStudio(studio) {
    return request.post('/api/studios')
      .send(studio)
      .then(res => res.body);
  }

  it('roundtrips a studio', () => {
    return saveStudio(paramount)
      .then(saved => {
        assert.ok(saved._id, 'saved has id');
        paramount = saved;
      })
      .then(() => {
        return request.get(`/api/studios/${paramount._id}`);
      })
      .then(res => res.body)
      .then(studio => {
        assert.deepEqual(studio, paramount);
      });
  });

});