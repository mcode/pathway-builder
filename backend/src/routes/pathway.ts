import { Router } from 'express';
import Pathway from 'models/pathway';

const router = Router();

router.get('/', (req, res) => {
  return Pathway.find({ id: '2TJDsrHux' });
});

router.post('/', (req, res) => {
  new Pathway(req.body).save((err, product) => {
    if (err) res.send('Error adding pathway');
    else res.send(`Added new user ${product._id}`);
  });
});

router.get('/:id', (req, res) => {
  Pathway.findById(req.params.id, (err, user) => {
    if (err) res.send('err');
    else res.send('user');
  });
});

export default router;