const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('studios API', () => {

  before(db.drop);
  
  it('GETs all studios', () => {
    return request.get('/api/studios')
      .then(res => {
        const studios = res.body;
        assert.deepEqual(studios, []);
      });
  });

  let fakeStudio = {
    name: 'Paramount',
    address: {
      city: 'LA',
      state: 'California',
      country: 'USA'
    }
  };

  // let fakeStudio2 = {
  //   name: 'Disney',
  //   address: {
  //     city: 'Burbank',
  //     state: 'California',
  //     country: 'USA'
  //   }
  // };

  function savedStudio(studio) {
    return request.post('/api/studios')
      .send(studio)
      .then(res => res.body);
  }

  it('roundtrips a studio', () => {
    return savedStudio(fakeStudio)
      .then(saved => {
        assert.ok(saved._id, 'saved has id');
        fakeStudio = saved;
      })
      .then(() => {
        return request.get(`/api/studios/${fakeStudio._id}`);
      })
      .then(res => {
        const studio = res.body;
        assert.deepEqual(studio, fakeStudio);
      });
  });
});
