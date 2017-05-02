const assert = require('chai').assert;
const Studio = require('../../lib/models/studio');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Studio Model', () => {

  describe('happy path', () => {

    it('validates studio name', () => {
      const testStudio = new Studio({
        name: 'Studio Nicky',
        address: {
          city: 'Portland',
          state: 'OR',
          country: 'USA'
        }
      });
      return testStudio.validate();
    });

  });

  describe('validation failures', () => {

    it('requires name', () => {
      const studio = new Studio();
      return studio.validate()
      .then(expectedValidation, 
      err => {
        const errors = err.errors;
        assert.ok(errors.name && errors.name.kind === 'required');
      });
    });
  });


});