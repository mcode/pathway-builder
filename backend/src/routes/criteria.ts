import { Router } from 'express';
import Criteria from 'models/criteria';
import { addCrudRoutes } from 'handlers/crudHandler';

const router = Router();

addCrudRoutes(router, Criteria);

export default router;
