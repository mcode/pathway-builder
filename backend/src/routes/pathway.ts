import { Router } from 'express';
import Pathway from 'models/pathway';
import {
  getAllHandler,
  putByIdHandler,
  deleteByIdHandler,
  getByIdHandler,
} from '../handlers/crudHandler';

const router = Router();

router.get('/', (req, res) => {
  getAllHandler({ model: Pathway, req: req, res });
});

router.put('/:id', (req, res) => {
  putByIdHandler({ model: Pathway, req: req, res: res });
});

router.delete('/:id', (req, res) => {
  deleteByIdHandler({ model: Pathway, req: req, res: res });
});

router.get('/:id', (req, res) => {
  getByIdHandler({ model: Pathway, req: req, res: res });
});

export default router;
