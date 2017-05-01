// const assert = require('assert');
const Actor = require('../../lib/models/actor');


describe('actor validations', () => {

  it('validates actor', () => {
    const actor = new Actor({
      name: 'Ewan McGregor',
      dob: 1976
    });

    actor.save();
    return actor.validate();
  });
});