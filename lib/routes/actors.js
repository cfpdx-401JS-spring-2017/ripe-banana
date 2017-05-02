const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');

router
.get('/', (req, res, next) => {
  Actor.find()
    .then(actors => res.send(actors))
    .catch(next);
})

.post('/', (req, res, next) => {
  new Actor(req.body).save()
    .then(actor => res.send(actor))
    .catch(next);
})

.get('/:id', (req, res, next) => {
  
  const id = req.params.id;
  Actor.findById(id)
    .then(actor => {
      if(!actor) {
        return res.status(404).statusMessage(`${id} not found`);
      } else res.send(actor);
    
    }).catch(next);

});

module.exports = router;