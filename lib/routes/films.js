const Router = require('express').Router;
const router = Router();
const Film = require('../models/film');

router
  .get('/', (req, res, next) => {
    Film.find()
      .then(films => res.send(films))
      .catch(next);
  })

  .post('/', (req, res, next) => {
    new Film(req.body)
      .save()
      .then(film => res.send(film))
      .catch(next);
  })

  //TODO: Return studio NAME and cast list
  .get('/:id', (req, res, next) => {
    const id = req.params.id;
    Film.findById(id)
      .then(film => {
        if (!film) res.status(404).statusMessage(`${id} not found`);
        else res.send(film);
      })
      .catch(next);
  });

  //TODO: Write /PUT 'UPDATE' method that allows you to add actors/cast

module.exports = router;