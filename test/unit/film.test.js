const assert = require('chai').assert;
const Film = require('../../lib/models/film');

const expectedValidation = () => { throw new Error('expected validation error'); };

describe('film validations', () => {

    it('validates film name', () => {
        const testFilm = new Film({
            title: 'nicky\'s epic movie',
            studio: '5907752c2a9d83170a380ca8',
            released: '1988'
        });
        return testFilm.validate();
    });

    describe('validation failures', () => {

        it('requires name', () => {
            const film = new Film();
            film.validate()
                .then(expectedValidation,
                err => {
                    const errors = err.errors;
                    assert.ok(errors.title && errors.title.kind === 'required');
                    assert.ok(errors.studio && errors.studio.kind === 'required');
                    assert.ok(errors.released && errors.released.kind === 'required');
                });
        });
    });
});