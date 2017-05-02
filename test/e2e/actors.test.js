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


});