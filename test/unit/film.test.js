const assert = require('chai').assert;
const Film = require('../../lib/models/film');
const Studio = require('../../lib/models/studio');

const expectedValidation = () => { throw new Error('expected validation errors'); };

const paramount = new Studio({
  name: 'Paramount',
  address: {
    city: 'Portland',
    state: 'OR',
    country: 'USA'
  }
});

describe('Film Model', () => {

  describe('validations pass', () => {

    it('happy path', () => {
      const testFilm = new Film({
        title: 'Arrival',
        studio: paramount._id,
        released: 2016
      });
      return testFilm.validate();
    });

  });

  describe('validation fails', () => {

    it('no studio', () => {
      const indieFilm = new Film({
        name: 'Arrival',
        studio: 90909,
        released: 2016
      });
      return indieFilm.validate()
        .then(expectedValidation,
        err => {
          const errors = err.errors;
          assert.ok(errors.studio && errors.studio.kind === 'ObjectID');
        });
    });

  });

});