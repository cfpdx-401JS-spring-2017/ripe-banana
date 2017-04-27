const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');

router
  .get('/', (req, res, next) => {
    Studio.find()
      .then(studios => res.send(studios))
      .catch(next);
  });

module.exports = router;