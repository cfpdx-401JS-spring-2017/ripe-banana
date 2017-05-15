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

  .get('/:id', (req, res, next) => {
    const id = req.params.id;

    Promise.all([
      Studio.findById(id)
        .lean()
        .select('name address'),
      Film.find({ studio: id })
        .lean()
        .select('title')
    ])
      .then(result => {
        const studio = result[0];
        if (!studio) return res.status(404).send(`${id} not found`);
        const film = result[1];

        studio.films = film;
        res.send(studio);
      })
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Studio.findByIdAndRemove(id)
      .then(deletedDoc => {
        res.send({ removed: deletedDoc ? true : false });
      })
      .catch(next);
  });





module.exports = router;