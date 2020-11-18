import { Router } from 'express';
import Pathway from 'models/pathway';
import { addCrudRoutes } from 'handlers/crudHandler';

const router = Router();

addCrudRoutes(router, Pathway);

export default router;
