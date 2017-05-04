const assert = require('chai').assert;
const Studio = require('../../lib/models/studio');

describe('plant model', () => {

  it('ensures invalid documents are not accepted', () => {
    return new Studio().validate()
      .then(() => { throw new Error('Expected validation to fail'); },
      err => {
        const error = err.errors;

        assert.ok(error.name && error.name.kind === 'required');
      });
  });

  it('accepts valid documents', () => {
    const studio = new Studio({ name: 'Universal', address: { city: 'Hollywood', state: 'Los Angeles', country: 'USA' } });

    studio.validate();
  });

});