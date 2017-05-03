const assert = require('assert');
const Actor = require('../../lib/models/actor');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('actor validations', () => {

    it('validates actor name and dob', () => {
        const testActor = new Actor({
            name: 'Alicia Silverstone',
            dob: 1976
        });
        return testActor.validate();
    });
});

describe('Validation failures', () => {

    it('requires actor name', () => {
        const actor = new Actor();
        return actor.validate()
            .then(expectedValidation,
            err => {
                const errors = err.errors;
                assert.ok(errors.name && errors.name.kind === 'required');
            });
    });

});