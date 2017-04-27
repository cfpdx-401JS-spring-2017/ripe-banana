const assert = require('chai').assert;
const Studio = require('../../lib/models/studio');

describe('Studio model', () => {

  it('validates studio name', () => {
    const testStudio = new Studio({
      name: 'Studio Nicky'
    });
    return testStudio.validate();
  });

});