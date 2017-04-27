const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('studios api', () => {

    before(db.drop);

    it('GETS all studios', () => {
        return request
            .get('/api/studios')
            .then(res => {
                const studios = res.body;
                assert.deepEqual(studios, []);
            });
    });

    let fakeStudio1 = {
        name: 'fake studio',
        address: {
            city: 'faketown',
            state: 'califeaux',
            country: 'usa'
        }
    };

    // let fakeStudio2 = {
    //     name: 'fake studio2',
    //     address: {
    //         city: 'fakertown',
    //         state: 'califeaux',
    //         country: 'usa'

    //     }

    // };


    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(res => res.body);

    }

    it('rountrips a new homie', () => {
        return saveStudio(fakeStudio1)
            .then(savedStudio => {
                assert.ok(savedStudio._id, 'saved has id');
                fakeStudio1 = savedStudio;
            })
            .then(() => {
                return request.get(`/api/studios/${fakeStudio1._id}`);
            })
            .then(res => res.body)
            .then(gotStudio => {
                assert.deepEqual(gotStudio, fakeStudio1);
            });
    });


});

