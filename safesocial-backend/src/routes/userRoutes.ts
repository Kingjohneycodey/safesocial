import { Router } from 'express';
import { createUser, getUser, getAllUsers, checkNameExists, updateUserName } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/:id', getUser);
router.get('/', getAllUsers);
router.post('/check-name', checkNameExists);
router.post('/update-name', updateUserName);

export default router;
