const assert = require('chai').assert;
const Actor = require('../../lib/models/actor');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Actor Model', () => {

  describe('validations pass', () => {

    it('validation success', () => {
      const djr = new Actor({
        name: 'David Rappoccio',
        dob: 2088
      });
      return djr.validate();
    });

  });

  describe('validation fails', () => {
    it('requires name', () => {
      const actress = new Actor();
      return actress.validate()
      .then(expectedValidation, 
      err => {
        const errors = err.errors;
        assert.ok(errors.name && errors.name.kind === 'required');
      });
    });
  });

});