// const assert = require('assert');
// const Film = require('../../lib/models/film');

// const expectedValidation = () => { throw new Error('expected validation errors but did not get any'); };

// describe('Film validations', () => {

//   it('validates film name', () => {
//     const studioObject = new studioObject({
      
//     });
//     const testFilm = new Film({
//       name: 'Clueless',
//       studio: studio._id,
//       released: 1995
//     });
//     return testFilm.validate();
//   });
//   describe('validation failures', () => {
    
//     it('requires name', () => {
//       const film = new Film();
//       return film.validate()
//         .then(expectedValidation, 
//           err => {
//             const errors = err.errors;
//             assert.ok(errors.name && errors.name.kind === 'required');
//           });
//     });
//   });
// }); 

