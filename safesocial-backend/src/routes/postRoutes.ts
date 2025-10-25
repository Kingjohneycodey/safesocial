import { Router } from 'express';
import { createPost, getPost, getAllPosts } from '../controllers/postController';

const router = Router();

router.post('/', createPost);
// router.post('/onchain', createPostOnchain);
router.get('/:id', getPost);
router.get('/', getAllPosts);

export default router;
