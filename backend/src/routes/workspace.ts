import { Router } from 'express';
import Workspace from 'models/workspace';
import { addCrudRoutes } from 'handlers/crudHandler';

const router = Router();

addCrudRoutes(router, Workspace);

export default router;
