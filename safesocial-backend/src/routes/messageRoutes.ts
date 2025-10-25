import { Router } from 'express';
import { createMessage, getMessage, getAllMessages } from '../controllers/messageController';

const router = Router();

router.post('/', createMessage);
router.get('/:id', getMessage);
router.get('/', getAllMessages);

export default router;
