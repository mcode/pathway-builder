import { Router } from 'express';
import Pathway from 'models/pathway';

const router = Router();

router.get('/', (req, res) => {
  Pathway.find({}, (err, product) => {
    if (err) res.send('Error getting all pathways');
    else res.send(product);
  });
});

router.put('/:id', (req, res) => {
  if (req.params.id !== req.body.id) res.status(409).send('Pathway id does not match URL id');
  Pathway.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { overwrite: true, new: true, upsert: true },
    (err, product) => {
      if (err) res.send(err);
      else res.status(201).send(product);
    }
  );
});

router.delete('/:id', (req, res) => {
  Pathway.deleteOne({ id: req.params.id }, (err) => {
    if (err) res.send(err);
    else res.status(200).send(`Deleted pathway ${req.params.id}`);
  });
});

router.get('/:id', (req, res) => {
  Pathway.findOne({ id: req.params.id }, { _id: 0 }, (err, pathway) => {
    if (err) res.send(err);
    if (pathway) {
      res.status(200).send(pathway);
    } else res.status(404).send(pathway);
  });
});

export default router;
