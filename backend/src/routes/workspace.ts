import { Router } from 'express';
import Workspace from 'models/workspace';

const router = Router();

router.get('/', (_, res) => {
  Workspace.find({}, (err, product) => {
    if (err) res.status(500).send('Error getting all Workspaces');
    else res.status(200).send(product);
  });
});

router.put('/:id', (req, res) => {
  if (req.params.id !== req.body.id) res.status(409).send('Workspace id does not match URL id');
  Workspace.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { overwrite: true, new: true, upsert: true, rawResult: true },
    (err, product) => {
      if (err) res.status(500).send(err);
      else res.status(product.lastErrorObject.updatedExisting ? 200 : 201).send(product.value);
    }
  );
});

router.delete('/:id', (req, res) => {
  Workspace.deleteOne({ id: req.params.id }, (err) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(`Deleted Workspace ${req.params.id}`);
  });
});

router.get('/:id', (req, res) => {
  Workspace.findOne({ id: req.params.id }, { _id: 0 }, (err, Workspace) => {
    if (err) res.status(500).send(err);
    if (Workspace) {
      res.status(200).send(Workspace);
    } else res.status(404).send(Workspace);
  });
});

export default router;
