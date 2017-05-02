const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('films API', () => {

  before(db.drop);

  let studio = null;

  before(() => {
    return request.post('/api/studios')
      .send({ name: 'Gale Force'})
      .then(res => res.body)
      .then(savedStudio => {
        studio = savedStudio;
      });
  });
  

  it('GETs all films', () => {

    return request.get('/api/films')
      .then(res => {
        const films = res.body;
        assert.deepEqual(films, []);
      });
  });


  let fakeFilm = {
    title: 'Drive',
    released: '2010'
  };


  function savedFilm(film) {
    film.studio = studio._id;
    return request.post('/api/films')
      .send(film)
      .then(res => film = res.body);
  }

  it('roundtrips a film', () => {
    return savedFilm(fakeFilm)
      .then(saved => {
        assert.ok(saved._id, 'saved has id');
        fakeFilm = saved;
      })
      .then(() => {
        return request.get(`/api/films/${fakeFilm._id}`);
      })
      .then(res => {
        const film = res.body;
        assert.deepEqual(film, fakeFilm);
      });
  });
});