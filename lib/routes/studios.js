const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');

router
.get('/', (req, res, next) => {
  Studio.find()
    .then(studios => res.send(studios))
    .catch(next);
})

.post('/', (req, res, next) => {
  new Studio(req.body).save()
    .then(studio => res.send(studio))
    .catch(next);
})

.get('/:id', (req, res, next) => {

  const id = req.params.id;
  Studio.findById(id)
    .then(studio => {
      if(!studio) {
        return res.status(404).statusMessage(`${id} not found`);
      } else res.send(studio);

    }).catch(next);
});



module.exports = router;