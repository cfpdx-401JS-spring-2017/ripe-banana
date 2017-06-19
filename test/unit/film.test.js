const Film = require('../../lib/models/film');
const Studio = require('../../lib/models/studio');
const Cast = require('../../lib/models/cast');
const Actor = require('../../lib/models/actor');


// const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Film model', () => {

    it('validates good model', () => {
        const actor = new Actor({
            name: 'Chris Pratt', 
            dob: '04/09/1990'
        });

        const cast = new Cast({
            role: 'Lead', 
            actor: [actor._id]
        });

        const studio = new Studio({
            name: 'Warner Bros',
            address: {
                city: 'Wyoming',
                state: 'CA',
                country: 'USA'
            }
        });

        const film = new Film({
            title: 'O Brother',
            studio: studio._id,
            released: '08/23/1989',
            cast: [cast]
        });
        film.save();
        return film.validate();
    });
});

