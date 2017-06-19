// const assert = require('chai').assert;
const Actor = require('../../lib/models/actor');

// const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Actor model  ', () => {

    it('validates an actor', () => {
        const actor = new Actor({
            name: 'Jayden Smith', 
            dob: '07/23/1995'
        });

        actor.save();
        return actor.validate();
    });
});