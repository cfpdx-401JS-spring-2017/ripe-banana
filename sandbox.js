// require('./lib/connect');
// const Film = require('./lib/models/film');
// const Studio = require('./lib/models/studio');


// let film = new Film ({
//     title: 'Kung Fu Panda'
// });

// let studio = new Studio ({
//     name: 'Billy Studio'
// });

// studio.save()
//     .then(savedStudio => {
//         studio = savedStudio;
//     })
//     .then(() => {
//         film.studio = studio._id;
//         return film.save();
//     })
//     .then(savedFilm => {
//         film = savedFilm;
//     })
//     .then(() =>{
//         return Film.findById(film._id);
//     })
//     .then(foundFilm => {
//         foundFilm.title = 'Stupid Panda';
//         return foundFilm.save();
//     })
//     .then(savedFilm => {
//         console.log(savedFilm);
//     })
//     .catch(err => {
//         console.log(err);
//     });