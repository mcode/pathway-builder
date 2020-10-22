import { Router } from 'express';
import Pathway from 'models/pathway';

const router = Router();

router.get('/', (req, res) => {
  return Pathway.find({ id: '2TJDsrHux' });
});

router.put('/:id', (req, res) => {
  if (req.params.id !== req.body.id) res.status(409).send('Pathway id does not match URL id');
  Pathway.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { overwrite: true, new: true },
    (err, product) => {
      if (err) res.send(err);
      else res.status(201).send(product);
    }
  );
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
