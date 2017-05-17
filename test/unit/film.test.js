const assert = require('assert');
const Film = require('../../lib/models/film');
 
const expectedValidation = () => { throw new Error('expected validation errors but did not get any'); };

describe('Film validations', () => {

  it('validates film name, studio name and released date', () => {

    const testFilm = new Film({
      title: 'Clueless',
      studio: '58f925c13a771c1d50f05555',
      released: 1995,
      cast: []
    });
    return testFilm.validate();
  });

  describe('validation failures', () => {
    
    it('requires name, studio and released date', () => {
      const film = new Film();
      return film.validate()
        .then(expectedValidation, 
          err => {
            const errors = err.errors;
            assert.ok(errors.title && errors.title.kind === 'required');
          });
    });
  });
}); 

