const request = require('./_request');
const db = require('./_db');
const assert = require('chai').assert;

describe('Actors API', () => {

  before(db.drop);

  it('GET / all actors', () => {
    return request.get('/api/actors')
      .then(res => {
        const actors = res.body;
        assert.deepEqual(actors, []);
      });
  });
});