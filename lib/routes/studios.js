const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');
const Film = require('../models/film');

router
  .get('/', (req, res, next) => {
    Studio.find()
      .lean()
      .select('name')
      .then(studios => res.send(studios))
      .catch(next);
  })

  .post('/', (req, res, next) => {
    new Studio(req.body)
      .save()
      .then(studio => res.send(studio))
      .catch(next);
  })

  //TODO: Return films that are attached to the studio
  .get('/:id', (req, res, next) => {
    const id = req.params.id;

    Promise.all([
      Studio.findById(id)
        .lean()
        .select('name address')
        .then(studio => {
          if (!studio) res.status(404).statusMessage(`${id} not found`);
          else res.send(studio);
        }),
      Film.find(`studio.${id}`)
        .lean()
        .select('title')
        .then(films => {
          if (!films) res.status(404).send('not found');
          else (res.send(films));
        })
        .catch(next)
    ]);
  })

  .put('/:id', (req, res, next) => {
    Studio.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(studio => res.send(studio))
      .catch(next);
  })

  //TODO: Make studio not deletable if contains films
  .delete('/:id', (req, res, next) => {
    Studio.findOneAndRemove(req.body)
      .then(response => {
        res.send({ removed: response ? true : false });
      })
      .catch(next);
  });

module.exports = router;