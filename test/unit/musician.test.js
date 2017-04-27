const assert = require('chai').assert;
const Musician = require('../../lib/models/musician');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Musician model', () => {

    it('validates good model', () => {
        const musician = new Musician({
            name: 'DJ Khaled',
            age: 38,
            songs: ['High Up', 'Fly UP', 'I know you']
        });
        return musician.validate();
    });

    describe('validation failures', () => {

        it('name and age and songs are required', () => {
            const musician = new Musician();
            return musician.validate()
                .then(expectedValidation,
                err => {
                    const errors = err.errors;
                    assert.ok(errors.age && errors.age.kind === 'required');
                    assert.ok(errors.name && errors.name.kind === 'required');
                    assert.ok(errors.songs && errors.songs.kind === 'required');
                });
        });

        it('they are at least 12 years old', () => {
            const musician = new Musician({
                name: 'Billy Bob',
                age: 10,
                songs: ['He goes']
            });

            return musician.validate()
                .then(expectedValidation,
                err => {
                    const errors = err.errors;
                    assert.ok(errors.age && errors.age.kind === 'min');
                }
                );
        });

        it('they have a name no bigger than 20 characters', () => {
            const musician2 = new Musician({
                name: 'banannananafefifofanah',
                age: 15,
                songs: ['He goes']
            }); 
            return musician2.validate()
                .then(expectedValidation,
                err => {
                    const errors = err.errors;
                    assert.ok(errors.name && errors.name.kind === 'maxlength');
                }
                );
        });
    });
});