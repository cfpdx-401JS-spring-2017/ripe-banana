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
            .select('title')
        ])
            .then(result => {
                const studio = result[0];
                const films = result[1];
                studio.films = films;
                res.send(studio);

                // if (!film) res.status(404).send(`${id} not found`);
                // else res.send(film);
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