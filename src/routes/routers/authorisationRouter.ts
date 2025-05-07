import { Router } from 'express';
import { login, register } from '../../controllers/authorisationController';

const router = Router();

router.post('/login', login);
router.post('/register', register);

export const authorisationRoutes = router;
