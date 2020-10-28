import { Router } from 'express';
import Criteria from 'models/criteria';

const router = Router();

router.get('/', (_, res) => {
  Criteria.find({}, (err, product) => {
    if (err) res.status(500).send('Error getting all Criteria');
    else res.status(200).send(product);
  });
});

router.put('/:id', (req, res) => {
  if (req.params.id !== req.body.id) res.status(409).send('Criteria id does not match URL id');
  Criteria.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { overwrite: true, new: true, upsert: true },
    (err, product) => {
      if (err) res.status(500).send(err);
      else res.status(201).send(product);
    }
  );
});

router.delete('/:id', (req, res) => {
  Criteria.deleteOne({ id: req.params.id }, (err) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(`Deleted Criteria ${req.params.id}`);
  });
});

router.get('/:id', (req, res) => {
  Criteria.findOne({ id: req.params.id }, { _id: 0 }, (err, Criteria) => {
    if (err) res.status(500).send(err);
    if (Criteria) {
      res.status(200).send(Criteria);
    } else res.status(404).send(Criteria);
  });
});

export default router;
