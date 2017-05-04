const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('film API', () => {

  before(db.drop);

  let studio = { name: 'Universal', address: { city: 'Hollywood', state: 'Los Angeles', country: 'USA' } };

  before(() => {
    return request.post('/studios')
      .send(studio)
      .then(res => res.body)
      .then(saved => studio = saved);
  });

  it('initial GET should return empty array', () => {
    return request.get('/films')
      .then(res => res.body)
      .then(films => assert.deepEqual(films, []));
  });

  let waterWorld = { title: 'WaterWorld', studio: '590643bc2cd3da2808b0e651', released: 1998 };

  it('POST should add a document', () => {
    waterWorld.studio = studio._id;

    return request.post('/films')
      .send(waterWorld)
      .then(res => res.body)
      .then(saved => {
        assert.ok(saved._id);

        waterWorld = saved;
      });
  });

  it('GET by id should return formatted document [{ title, studio.name }]', () => {
    return request.get(`/films/${waterWorld._id}`)
      .then(res => res.body)
      .then(film => {
        assert.propertyVal(film, 'title', 'WaterWorld');
        assert.propertyVal(film.studio, 'name', 'Universal');
      });
  });

  it('PUT should update a film', () => {
    waterWorld.released = 2000;

    return request.put(`/films/${waterWorld._id}`)
      .send(waterWorld)
      .then(res => res.body)
      .then(film => assert.equal(film.released, 2000));
  });

  it('DELETE should remove a film if it exists', () => {
    return request.delete(`/films/${waterWorld._id}`)
      .then(res => res.body)
      .then(result => assert.isTrue(result.removed));
  });
  
  it('DELETE should not remove a film if it does not exists', () => {
    return request.delete(`/films/${waterWorld._id}`)
      .then(res => res.body)
      .then(result => assert.isFalse(result.removed));
  });

});