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

});