//don't use chai b/c that's for api, not testing the part that makes api calls
// const assert = require('assert'); 
const  Studio = require('../../lib/models/studio');

describe('Studio validations', () => {

    it ('validates studio name', () => {
        const testStudio = new Studio({
            name: 'Studio Nicky',
        });
        return testStudio.validate();
    });
});