const assert = require('assert');
const Film = require('../../lib/models/film');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Film validations', () => {

    it.only('validates film name', () => {
        const testFilm = new Film({
            title: 'Clueless',
            released: 1995
        });
        return testFilm.validate();
    });
});

describe('Validation failures', () => {

    it('requires name', () => {
        const film = new Film();
        return film.validate()
            .then(expectedValidation,
            err => {
                const errors = err.errors;
                assert.ok(errors.title && errors.title.kind === 'required');
                assert.ok(errors.released && errors.released.kind === 'required');
            });
    });

});