import { Router } from 'express';
import Criteria from 'models/criteria';
import {
  deleteByIdHandler,
  getAllHandler,
  getByIdHandler,
  putByIdHandler,
} from 'handlers/crudHandler';

const router = Router();

router.get('/', (req, res) => {
  getAllHandler({ model: Criteria, req: req, res });
});

router.put('/:id', (req, res) => {
  putByIdHandler({ model: Criteria, req: req, res: res });
});

router.delete('/:id', (req, res) => {
  deleteByIdHandler({ model: Criteria, req: req, res: res });
});

router.get('/:id', (req, res) => {
  getByIdHandler({ model: Criteria, req: req, res: res });
});

export default router;
