// const request = require('./_request');
// const assert = require('chai').assert;
// const db = require('./_db');

// describe.only('two join routes are working',() => {
//     let studio = {
//         name: 'SS Studios',
//         address: {
//             city: 'Pasadena' ,
//             state: 'CA',
//             country: 'USA'
//         }
//     };

//     let actorOne = {
//         name: 'Johnny Drama',
//         dob: '03/22/1985'
//     };

//     let actorTwo = {
//         name: 'Brad Pitt',
//         dob: '03/22/1985'
//     };

    
//     before(db.drop);
//     before( () => {
//         return request.post('/api/actors')
//             .send(actorOne)
//             .then (res => {
//                 actorOne = res.body;
//             });
//     });

//     before( () => {
//         return request.post('/api/actors')
//             .send(actorTwo)
//             .then (res => {
//                 actorTwo = res.body;
//             });
//     });

//     before( () => {
//         return request.post('/api/studios')
//             .send(studio)
//             .then (res => studio = res.body);
//     });

//     let film = null;
//     before( () => {
//         let cast = [{ role: 'Supporting', actor: actorOne._id }, { role: 'Lead', actor: actorTwo._id }];

//         film = {
//             title: 'O Brother',
//             studio: studio._id,
//             released: '08/23/1989',
//             cast: cast
//         };
//         return request.post('/api/films')
//             .send(film)
//             .then (res => film = res.body);
//     });

//     it('initial /GET returns title and studio name', () => {
//         return request.get('/api/films')
//             .then(res => {
//                 let expectedFilm = {
//                     _id: film._id,
//                     title: film.title,
//                     studio: {
//                         _id: studio._id,
//                         name: studio.name
//                     }
//                 };
                
//                 assert.deepEqual(res.body[0], expectedFilm);
//             });
//     });

//     it(' /:id returns title and studio name and cast array', () => {
//         return request.get(`/api/films/${film._id}`)
//             .then(res => {
//                 let expectedFilm = {
//                     _id: film._id,
//                     title: film.title,
//                     studio: {
//                         _id: studio._id,
//                         name: studio.name
//                     },
//                     cast: film.cast
//                 };
                
//                 assert.deepEqual(res.body, expectedFilm);
//             });
//     });
// });