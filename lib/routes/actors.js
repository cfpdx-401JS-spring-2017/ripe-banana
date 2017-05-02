const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');
const Film = require('../models/film');

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

    Promise.all([
      Actor.findById(id)
        .lean()
        .select('name dob'),
      Film.find({ actor: id })
        .lean()
        .select('title')
    ])
      .then(result => {
        const actor = result[0];
        if (!actor) return res.status(404).send(`${id} not found`);
        const film = result[1];

        actor.films = film;
        res.send(actor);
      })
      .catch(next);
  })

  .post('/', (req, res, next) => {
    new Actor(req.body)
      .save()
      .then(actor => res.send(actor))
      .catch(next);
  });

module.exports = router;