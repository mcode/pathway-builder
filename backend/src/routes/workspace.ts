import { Router } from 'express';
import Workspace from 'models/workspace';
import {
  deleteByIdHandler,
  getAllHandler,
  getByIdHandler,
  putByIdHandler,
} from '../handlers/crudHandler';

const router = Router();

router.get('/', (req, res) => {
  getAllHandler({ model: Workspace, req: req, res });
});

router.put('/:id', (req, res) => {
  putByIdHandler({ model: Workspace, req: req, res: res });
});

router.delete('/:id', (req, res) => {
  deleteByIdHandler({ model: Workspace, req: req, res: res });
});

router.get('/:id', (req, res) => {
  getByIdHandler({ model: Workspace, req: req, res: res });
});

export default router;
