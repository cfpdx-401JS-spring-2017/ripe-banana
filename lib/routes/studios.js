const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');
const Film = require('../models/film');

router
  .get('/', (req, res, next) => {
    Studio
      .find()
      .select('name')
      .then(studios => res.send(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const id = req.params.id;

    Promise.all([
      Studio.findById(id).lean(),
      Film.find({ studio: id }).lean().select('title -_id')
    ])
    .then(result => {
      const studio = result[0];
      const film = result[1];

      studio.films = film;
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
    Studio
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updated => res.send(updated))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    const id = req.params.id;

    Film.find({ studio: id })
      .then(film => {
        if (!film.length) return Studio.findByIdAndRemove(req.params.id);
        else return res.send({ removed: false });
      })
      .then(response => {
        if (response.name) res.send({ removed: !!response });
      })
      .catch(next);

  });

module.exports = router;