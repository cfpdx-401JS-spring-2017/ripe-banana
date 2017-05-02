const Router = require('express').Router;
const router = Router();
const Film = require('../models/film');
// const Studio = require('../models/studio');

router
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .select('title studio')    
            .populate({
                path: 'studio',
                select: 'name'
            }) 
            .then(film => { 
                res.send(film);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .lean()
            .select('title studio cast')    
            .populate({
                path: 'studio',
                select: 'name'
            }) 
            .then(film => { 
                res.send(film);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new Film (req.body)
        .save()
        .then(film => res.send(film))
        .catch(err => next(JSON.stringify(err.errors, true, 2)));

    });

module.exports = router;
