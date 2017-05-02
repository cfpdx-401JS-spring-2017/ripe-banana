const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('films API', () => {

  before(db.drop);

  it('GETs all films', () => {

    return request.get('/api/films')
      .then(res => {
        const films = res.body;
        assert.deepEqual(films, []);
      });
  });

  let fakeFilm = {
    title: 'Drive',
    studio: 'Paramount',
    released: '2010'
};

function savedFilm(film) {
    return request.post('/api/film')
      .send(film)
      .then(res => res.body);
}

