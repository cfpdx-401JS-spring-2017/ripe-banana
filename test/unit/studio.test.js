const assert = require('chai').assert;
const Studio = require('../../lib/models/studio');

const expectedValidation = () => { throw new Error('expected validation error'); };

describe('studio validations', () => {

    it('validated studio name', () => {
        const testStudio = new Studio({
            name: 'studio nicky'
        });
        return testStudio.validate();
    });

    describe('validation failures', () => {

        it('requires name', () => {
            const studio = new Studio();
            studio.validate()
                .then(expectedValidation,
                err => {
                    const errors = err.errors;
                    assert.ok(errors.name && errors.name.kind === 'required');
                });
        });
    });
});