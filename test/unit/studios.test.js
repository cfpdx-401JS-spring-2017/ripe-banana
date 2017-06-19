const assert = require('chai').assert;
const Studio = require('../../lib/models/studio');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Studio model', () => {

    it('validates good model', () => {
        const studio = new Studio({
            name: 'Warner Bros',
            address: {
                city: 'Beverly Hills',
                state: 'CA',
                country: 'USA'
            }
        });
        return studio.validate();
    });

    describe('validation failures', () => {

        it('name is required', () => {
            const studio = new Studio();
            return studio.validate()
                .then(expectedValidation,
                err => {
                    const errors = err.errors;
                    assert.ok(errors.name && errors.name.kind === 'required');
                });
        });

        // it('address city is not a number', () => {
        //     const studio = new Studio({
        //         name: 'Billy Bob Studio',
        //         address: {
        //             city: Number(44) ,
        //             state: 'CA',
        //             country: 'USA'
        //         }
                
        //     });

        //     return studio.validate()
        //         .then(expectedValidation,
        //         err => {
        //             const errors = err.errors;
        //             assert.ok(errors.age && errors.age.kind === String);
        //         }
        //         );
        // });

    });

});