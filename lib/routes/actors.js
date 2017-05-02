const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');

router
  .get('/', (req, res, next) => {
    Actor.find()
      .then(actors => res.send(actors))
      .catch(next);
  });

module.exports = router;