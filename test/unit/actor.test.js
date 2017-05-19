const Actor = require('../../lib/models/actor');


describe('actor validations', () => {

  it('validates actor', () => {
    const testActor = new Actor({
      name: 'Ewan McGregor',
      dob: 1976
    });

    return testActor.validate();
  });
});