import { Request, Response } from 'express';
import { User } from '../models/user';

export const addFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;
  if (!userId || !friendId) {
    return res.status(400).json({ error: 'Missing userId or friendId' });
  }
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ error: 'User not found' });
    if (!user.friends) user.friends = [];
    if (!user.friends.includes(friendId)) user.friends.push(friendId);
    await user.save();
    res.json({ success: true, friends: user.friends });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('friends');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};
