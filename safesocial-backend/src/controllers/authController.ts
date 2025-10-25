import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { User } from '../models/user';

import { User as IUser } from '../models/user';
declare global {
  namespace Express {
    interface Request {
      user?: typeof IUser;
    }
  }
}

// Nonce generation and storage (in-memory for demo; use Redis/DB for production)
const nonces: Record<string, string> = {};

export const getNonce = async (req: Request, res: Response) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Missing address' });
  // Generate a random nonce
  const nonce = Math.floor(Math.random() * 1e16).toString();
  nonces[address.toLowerCase()] = nonce;
  res.json({ nonce });
};

// Example: Replace with actual BlockDAG verification logic
async function verifyBlockDAGSignature(address: string, signature: string, message: string): Promise<boolean> {
  // Use ethers to recover the address from the signed message
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === address.toLowerCase();
  } catch {
    return false;
  }
}

export const login = async (req: Request, res: Response) => {
  const { address, signature } = req.body;
  if (!address || !signature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const nonce = nonces[address.toLowerCase()];
  if (!nonce) return res.status(400).json({ error: 'Nonce not found. Request a new nonce.' });
  try {
    const isValid = await verifyBlockDAGSignature(address, signature, nonce);
    if (!isValid) return res.status(401).json({ error: 'Invalid signature' });
    delete nonces[address.toLowerCase()]; // Prevent replay
    let user = await User.findOne({ walletAddress: address });
    if (!user) {
      // User does not exist, create and flag for onboarding
      user = new User({ walletAddress: address});
      await user.save();
      const token = jwt.sign({ id: user._id, address, onboarding: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.json({ token, user, onboarding: true });
    }
    // User exists, return token and onboarding false
    const token = jwt.sign({ id: user._id, address, onboarding: false }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user, onboarding: false });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
