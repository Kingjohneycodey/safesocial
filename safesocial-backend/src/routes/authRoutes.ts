import { Router } from 'express';
import { login, me, getNonce } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.get('/me', me); 
router.post('/nonce', getNonce);

export default router;
