import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => res.send('Pathways Route'));

export default router;
