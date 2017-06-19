const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');

router

    .get('/', (req, res, next) => {
        Actor.find()
            .then(actor => {
                res.send(actor);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id)
            .then(actor => {
                if (!actor) res.status(404).statusMessage(`${req.params.id} not found`);
                else res.send(actor);         
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(actor => {
                res.send(actor);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new Actor (req.body)
        .save()
        .then(actor => res.send(actor))
        .catch(err => next(JSON.stringify(err.errors, true, 2)));
    })

    .delete('/:id', (req, res, next) => {
        const actorId = req.params.id;
        Actor.findByIdAndRemove(actorId)
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