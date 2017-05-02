const assert = require('chai').assert;
const Actor = require('../../lib/models/actor');

const expectedValidation = () => { throw new Error('expected validation error'); };

describe('actor validations', () => {

    it('validates actor name', () => {
        const testActor = new Actor({
            name: 'jeff bridges',
            dob: 1920
        });
        return testActor.validate();
    });

    describe('validation failures', () => {

        it('checks required fields are required', () => {
            const actor = new Actor();
            actor.validate()
                .then(expectedValidation,
                err => {
                    const errors = err.errors;
                    assert.ok(errors.name && errors.name.kind === 'required');
                    assert.ok(errors.dob && errors.dob.kind === 'required');
                });
        });
    });
});