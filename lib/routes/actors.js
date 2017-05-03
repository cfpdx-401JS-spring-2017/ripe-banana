const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');

router
  .get('/', (req, res, next) => {
    Actor.find()
      .lean()
      .select('name dob')
      .then(actors => res.send(actors))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const id = req.params.id;

    Actor.findById(id)
      .lean()
      .select('name dob film')
      .then(result => res.send(result))
      .catch(next);
  })

  .post('/', (req, res, next) => {
    new Actor(req.body)
      .save()
      .then(actor => res.send(actor))
      .catch(next);
  });

module.exports = router;