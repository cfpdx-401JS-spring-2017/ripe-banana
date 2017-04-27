const Router = require('express').Router;
const router = Router();
const Musician = require('../models/musician');

router
    .get('/', (req, res, next) => {
        Musician.find()
            .then(musician => res.send(musician))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Musician.findById(id)
            .then(musician => {
                if (!musician) res.status(404).statusMessage(`${id} not found`);
                else res.send(musician);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new Musician(req.body)
            .save()
            .then(musician => res.send(musician))
            .catch(next);
    })

    .put('/:id', (req, res, next) => { 
        Musician.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(musician => res.send(musician))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => { 
        Musician.findByIdAndRemove(req.params.id)
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