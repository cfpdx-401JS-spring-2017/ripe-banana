const Router = require('express').Router;
const router = Router();

const Studio = require('../models/studio');
const Film = require('../models/film');

router
    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            // .populate({
            //     path: 'film',
            //     select: 'title'
            // })
            .then(studios => res.send(studios))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;

        Promise.all([
            Studio.findById(id)
                .lean()
                .select('name address')
                .then(studio => {
                    if (!studio) throw { code: 404, error: `${id} not found` };
                    else (res.send(studio));
                }),
            Film.find(`studio.${id}`)
                .lean()
                .select('title')
                .then(films => {
                    if (!films) throw { code: 404, error: `${id} not found` };
                    else (res.send(films));
                })
                .catch(next)
        ]);
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
        Studio.findByIdAndRemove(req.params.id)
            .then(response => {
                res.send({ removed: !!response });
            })
            .catch(next);
    });

module.exports = router;