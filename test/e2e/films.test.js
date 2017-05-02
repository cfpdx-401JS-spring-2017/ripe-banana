const request = require('./_request');
const db = require('./_db');
const assert = require('chai').assert;

describe('Films API', () => {

  before(db.drop);

  it('GET / all films', () => {
    return request.get('/api/films')
      .then(res => {
        const films = res.body;
        assert.deepEqual(films, []);
      });
  });

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

  let coraline = {
    title: 'Coraline',
    studio: '',
    released: '2005',
    cast: []
  };

  let kuboTwoStrings = {
    title: 'Kubo and the Two Strings',
    studio: '',
    released: '2016',
    cast: []
  };

  function saveFilm(film) {
    return request.post('/api/films')
      .send(film)
      .then(res => res.body);
  }

  it('save a film with studio', () => {
    return saveStudio(laika)
    .then(studio => {
      assert.ok(studio._id, 'studio saved with id');
      coraline.studio = laika._id = studio._id;
    })
    .then(() => {
      return saveFilm(coraline);
    })
    .then(saved => {
      assert.ok(saved._id, 'saved has id');
    });
  });

});