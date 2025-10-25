import { Request, Response } from 'express';
import { Post } from '../models/post';
import { User } from '../models/user';
import { postRegistryContract, dataVaultContract, provider } from '../lib/contracts';
import { ethers } from 'ethers';

export const createPost = async (req: Request, res: Response) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const nextPostIdBigInt = await postRegistryContract.nextPostId();
  
    const nextPostId = nextPostIdBigInt.toString();
    const posts = [];
    for (let id = 1; id <= Number(nextPostId); id++) {
      const post = await postRegistryContract.getPost(id);
      console.log(`Post ${id}:`, {
        owner: post.owner,
        description: post.description,
        fileId: post.fileId,
        price: post.price,
        isPublic: post.isPublic,
        exists: post.exists
      });
      if (post.exists) {
        const price = Number(post.price?.toString?.() || post.price || 0);
        const isPublic = post.isPublic || price === 0; // Free posts should be accessible to everyone
        
        console.log(`Post ${id} processed:`, {
          originalPrice: post.price,
          convertedPrice: price,
          originalIsPublic: post.isPublic,
          finalIsPublic: isPublic
        });
        
        // Fetch creator information
        let creatorName = 'Unknown User';
        try {
          const creator = await User.findOne({ walletAddress: post.owner });
          if (creator) {
            creatorName = creator.name || 'Anonymous';
          }
        } catch (err) {
          console.log(`Failed to fetch creator for ${post.owner}:`, err);
        }

        posts.push({
          id: id.toString(),
          owner: post.owner,
          creatorName: creatorName,
          description: post.description,
          fileId: post.fileId,
          price: price,
          isPublic: isPublic,
          createdAt: post.createdAt?.toString?.() || post.createdAt,
          updatedAt: post.updatedAt?.toString?.() || post.updatedAt,
          exists: post.exists,
        });
      }
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// DEPRECATED: Let users sign/create posts onchain; do not submit txs server-side.
// export const createPostOnchain = async (req: Request, res: Response) => {
//   try {
//     const { description, price, isPublic, cid, fileName } = req.body;
//     const fileId = ethers.keccak256(ethers.toUtf8Bytes(cid + fileName));
//     const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY!;
//     const wallet = new ethers.Wallet(adminPrivateKey, provider);
//     const dataVaultWithSigner = dataVaultContract.connect(wallet) as any;
//     await dataVaultWithSigner.registerFile(fileId, cid, "");
//     const postRegistryWithSigner = postRegistryContract.connect(wallet) as any;
//     await postRegistryWithSigner.createPost(fileId, description, price, isPublic);
//     res.json({ success: true, fileId, cid });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
//   }
// };
