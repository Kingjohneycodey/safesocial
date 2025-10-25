import { Router } from 'express';
import { addFriend, getFriends } from '../controllers/friendController';

const router = Router();

router.post('/add', addFriend);
router.get('/:userId', getFriends);

export default router;
