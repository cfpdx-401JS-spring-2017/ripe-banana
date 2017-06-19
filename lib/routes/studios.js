const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');
const Film = require('../models/film');

router
    .get('/', (req, res, next) => {
        Studio.find()
            .then(studio => res.send(studio))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const storeId = req.params.id;
        Promise.all([
            Studio.findById(storeId).lean(),
            Film.find({studio: storeId}).lean()
            .select('title')
        ])
        .then(result => {
            const studio = result[0];
            const film = result[1];
            if (!studio) res.status(404).statusMessage(`${storeId} not found`);
            else if(result[1]) {
                studio.films = [];
                film.forEach(lalalaladu => {
                    studio.films.push(lalalaladu.title);
                });
                res.send(studio); 
            }
            else res.send(studio);          
        })
        .catch(next);
    })

    .post('/', (req, res, next) => {
        new Studio (req.body)
        .save()
        .then(store => res.send(store))
        .catch(err => next(JSON.stringify(err.errors, true, 2)));

    })

    .put('/:id', (req, res, next) => { 
        const storeId = req.params.id;
        Studio.findByIdAndUpdate(storeId, req.body, { new: true })
            .then(studio => res.send(studio))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        const storeId = req.params.id;
        Studio.findByIdAndRemove(storeId)
        .then(response => {
                // inspect response, which will be the deleted
                // documented, OR undefined if no document was 
                // deleted
            res.send({ removed: response ? true : false });
                // another way to write above:
                // res.send({ removed: !!response });
        })
        .catch(next);
    });
    
module.exports = router;