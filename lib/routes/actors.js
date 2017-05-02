const Router = require('express').Router;
const router = Router();

const Actor = require('../models/actor');

router
    .get('/', (req, res, next) => {
        Actor.find()
        .catch(next);


    })

    .post('/', (req, res, next) => {
        new Actor(req.body)
            .save()
            .then(actor => res.send(actor))
            .catch(next);
    });

module.exports = router;