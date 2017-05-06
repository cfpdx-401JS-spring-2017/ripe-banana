const Router = require('express').Router;
const router = Router();

const Studio = require('../models/studio');
const Film = require('../models/film');

router
    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name address')
            .then(studios => res.send(studios))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;

        Promise.all([
            Studio.findById(id)
                .lean()
                .select('name address'),
            Film.find({ studio: id })
                .lean()
                .select('title released cast')
        ])
            .then(result => {
                const studio = result[0];
                if (!studio) return res.status(404).send(`${id} not found`);
                const films = result[1];

                studio.films = films;
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
        delete req.body._id;
        Studio.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(studio => res.send(studio))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        const id = req.params.id;
        Promise.all([
            Studio.findById(id),
            Film.find({ studio: id })
        ])
            .then(results => {
                const film = results[1];
                if (film.length) return res.status(401).send(`Studio ${id} cannot be deleted`);
                Studio.findByIdAndRemove(id)
                    .then(response => {
                        res.send({ removed: !!response });
                    });
            })
            .catch(next);
    });

module.exports = router;