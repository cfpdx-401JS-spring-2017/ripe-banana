const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');
const Film = require('../../lib/models/film');

router
    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            .then(studios => res.send(studios))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Promise.all([
            Studio.findById(id).lean(),
            Film.find({ studio: id }).lean()
                .select('title') //we select here to avoid entire film obj in res
        ])
            .then(results => {
                const studio = results[0];
                if (!studio) res.status(404).send(`${id} not found`);
               //this is an implied else block
                const films = results[1];
                studio.films = films; //add a property of films and set it equal to the films result
                res.send(studio);
            })
            .catch(next);
    })


    .post('/', (req, res, next) => {
        new Studio(req.body)
            .save()
            .then(studio => res.send(studio))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Studio.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(studio => res.send(studio))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Studio.findByIdAndRemove(req.params.id)
            .then(response => {
                res.send({ removed: response ? true : false });
            })
            .catch(next);
    });

module.exports = router;